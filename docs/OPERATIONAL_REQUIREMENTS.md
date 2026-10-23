# Operational Requirements and Procedures

## Database Backup and Recovery

### Backup Strategy
- **Frequency**: Daily automated backups at 2:00 AM UTC
- **Retention**: Keep daily backups for 30 days, weekly backups for 12 weeks, monthly backups for 12 months
- **Backup Type**: PostgreSQL pg_dump with custom format
- **Storage**: Encrypted cloud storage with geographic redundancy

### Backup Command
```bash
# Manual backup
pg_dump -Fc -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME > backup_$(date +%Y%m%d).dump

# Automated backup script (configure in cron)
0 2 * * * /path/to/backup-script.sh
```

### Recovery Procedure
1. Stop application: `systemctl stop azaroth-backend`
2. Restore database: `pg_restore -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME backup.dump`
3. Verify data integrity: Run validation queries
4. Restart application: `systemctl start azaroth-backend`
5. Monitor logs for errors

### Testing Recovery
- Test restore procedure monthly on a staging environment
- Document restore time and any issues encountered
- Update procedures based on test results

## Monitoring and Alerting

### Required Monitoring
1. **Application Health**
   - Uptime monitoring (5-minute intervals)
   - API response times
   - Error rates (4xx, 5xx)
   - Database connection pool status

2. **Database Health**
   - Connection count
   - Query performance
   - Disk space usage
   - Replication lag (if applicable)

3. **Email Delivery**
   - Success/failure rates
   - Bounce rates
   - Queue depth (if using queue system)

4. **File Storage**
   - Disk usage on uploads directory
   - Orphaned file count
   - Storage growth trends

### Alert Thresholds
- Application down: Immediate alert
- Error rate > 5%: Alert within 5 minutes
- Database connection failures: Immediate alert
- Email failure rate > 10%: Alert within 15 minutes
- Disk usage > 80%: Alert within 1 hour

### Recommended Tools
- Application: New Relic, Datadog, or Prometheus + Grafana
- Database: PostgreSQL monitoring extensions
- Logs: ELK Stack or CloudWatch Logs
- Uptime: UptimeRobot or Pingdom

## Deployment Rollback Procedure

### Pre-Deployment Checklist
- [ ] Database backup completed
- [ ] All tests passing in CI
- [ ] Staging environment verified
- [ ] Rollback plan documented
- [ ] Team notified of deployment window

### Rollback Steps
1. **Immediate Rollback (if critical issues detected)**
   ```bash
   # Revert to previous deployment
   git revert <commit-hash>
   # Or use deployment tool rollback command
   ```

2. **Database Rollback (if schema changed)**
   - Restore from pre-deployment backup
   - Run data migration scripts in reverse
   - Verify data integrity

3. **Verification**
   - Run smoke tests
   - Check application logs
   - Monitor error rates
   - Verify critical functionality

4. **Post-Rollback**
   - Document root cause
   - Create fix for the issue
   - Test fix thoroughly
   - Schedule redeployment

### Rollback Time Target
- Application rollback: < 5 minutes
- Database rollback: < 15 minutes
- Full verification: < 30 minutes

## Environment Variables

### Required Production Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_CA_CERT=/path/to/ca-cert.pem  # For TLS verification

# JWT
JWT_SECRET=<strong-random-secret-min-32-chars>

# Email
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=noreply@azaroth-techhive.com
EMAIL_PASS=<app-specific-password>

# Application
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://azaroth-techhive.com
```

### Security Notes
- Never commit secrets to version control
- Use secret management (AWS Secrets Manager, Azure Key Vault, etc.)
- Rotate secrets quarterly
- Use different secrets for each environment

## Incident Response

### Severity Levels
- **P1 - Critical**: System down, data loss, security breach (response < 15 min)
- **P2 - High**: Major functionality broken, performance degraded (response < 1 hour)
- **P3 - Medium**: Minor functionality issues (response < 4 hours)
- **P4 - Low**: Cosmetic issues, documentation errors (response < 24 hours)

### Response Process
1. Acknowledge incident
2. Assess severity and impact
3. Mobilize response team
4. Implement temporary fix if needed
5. Investigate root cause
6. Implement permanent fix
7. Document incident and lessons learned

## Maintenance Schedule

### Daily
- Review error logs
- Check disk space
- Verify backup completion

### Weekly
- Review performance metrics
- Check for security updates
- Review failed email deliveries

### Monthly
- Test backup restoration
- Review and rotate secrets
- Clean up old logs and temporary files
- Run orphaned file cleanup script

### Quarterly
- Security audit
- Performance review
- Capacity planning
- Disaster recovery drill
