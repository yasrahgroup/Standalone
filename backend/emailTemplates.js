// backend/emailTemplates.js
// Professional branded email templates for Azaroth Tech-Hive

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (str === null || str === undefined || str === '') {
    return '';
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Format date for display
 * @param {Date} date - Date object or ISO string
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Generate Contact Us confirmation email HTML
 * @param {Object} data - Contact submission data
 * @param {string} data.fullName - Customer full name
 * @param {string} data.workEmail - Customer email
 * @param {string} data.companyName - Company name
 * @param {string} data.enquiryAbout - Enquiry type/subject
 * @param {string} data.phone - Phone number (optional)
 * @param {number} data.submissionId - Database submission ID
 * @param {string} data.submittedAt - Submission timestamp
 * @returns {string} HTML email content
 */
function renderContactConfirmationEmail(data) {
  const {
    fullName = '',
    workEmail = '',
    companyName = '',
    enquiryAbout = '',
    phone = '',
    submissionId = '',
    submittedAt = ''
  } = data;

  const referenceNumber = submissionId ? `AZ-CONTACT-${submissionId}` : 'Pending';
  const submissionDate = formatDate(submittedAt);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Contact Confirmation - Azaroth Tech-Hive</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a192f 0%, #1a365d 50%, #2c5282 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 1px;">AZAROTH TECH-HIVE</h1>
                    <p style="margin: 10px 0 0 0; color: #90cdf4; font-size: 14px; letter-spacing: 2px;">TECHNOLOGY. INNOVATION. SOLUTIONS.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="background-color: #4299e1; height: 4px;"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0; color: #2d3748; font-size: 16px;">Dear ${escapeHtml(fullName)},</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <h2 style="margin: 0 0 15px 0; color: #1a365d; font-size: 24px;">Thank You for Contacting Us!</h2>
                    <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                      Thank you for reaching out to Azaroth Tech-Hive. We have successfully received your enquiry. Our team will review your message and get back to you as soon as possible.
                    </p>
                  </td>
                </tr>

                <!-- Reference Number Card -->
                <tr>
                  <td style="padding: 25px; background-color: #ebf8ff; border-left: 4px solid #4299e1; border-radius: 4px; margin-bottom: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Your Reference Number</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0; color: #2b6cb0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">${escapeHtml(referenceNumber)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Enquiry Summary -->
                <tr>
                  <td style="padding: 25px; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <h3 style="margin: 0; color: #1a365d; font-size: 16px; border-bottom: 2px solid #4299e1; padding-bottom: 8px;">Enquiry Summary</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Company:</strong> ${escapeHtml(companyName)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Email:</strong> ${escapeHtml(workEmail)}</p>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Enquiry Type:</strong> ${escapeHtml(enquiryAbout)}</p>
                        </td>
                      </tr>
                      ${submissionDate ? `
                      <tr>
                        <td>
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Submission Date:</strong> ${escapeHtml(submissionDate)}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>

                <!-- Next Steps -->
                <tr>
                  <td style="padding-top: 25px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 20px; background-color: #fffaf0; border-left: 4px solid #ed8936; border-radius: 4px;">
                          <h4 style="margin: 0 0 10px 0; color: #c05621; font-size: 15px;">What Happens Next?</h4>
                          <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;">
                            Our team will review your enquiry and contact you using the details you provided.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Closing -->
                <tr>
                  <td style="padding-top: 30px;">
                    <p style="margin: 0; color: #4a5568; font-size: 15px;">Thank you for your interest in Azaroth Tech-Hive.</p>
                    <p style="margin: 15px 0 0 0; color: #4a5568; font-size: 15px;">Best regards,<br><strong>Azaroth Tech-Hive Team</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a365d; padding: 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold;">AZAROTH TECH-HIVE</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <p style="margin: 0; color: #90cdf4; font-size: 12px;">
                      <a href="https://azaroth-techhive.com" style="color: #90cdf4; text-decoration: underline;">azaroth-techhive.com</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px;">
                    <p style="margin: 0; color: #90cdf4; font-size: 12px;">hello@azaroth-techhive.com</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; color: #718096; font-size: 11px;">&copy; ${new Date().getFullYear()} Azaroth Tech-Hive. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate RFQ confirmation email HTML
 * @param {Object} data - RFQ submission data
 * @param {string} data.fullName - Customer full name
 * @param {string} data.workEmail - Customer email
 * @param {string} data.companyName - Company name
 * @param {string} data.referenceId - RFQ reference ID
 * @param {string} data.projectScope - Project scope
 * @param {string} data.targetTimeline - Expected timeline
 * @param {string} data.solutionCategories - Array of solution categories
 * @param {string} data.phone - Phone number (optional)
 * @param {string} data.country - Country
 * @param {string} data.submittedAt - Submission timestamp
 * @param {Array} data.uploadedFiles - Array of uploaded file names (optional)
 * @returns {string} HTML email content
 */
function renderRfqConfirmationEmail(data) {
  const {
    fullName = '',
    workEmail = '',
    companyName = '',
    referenceId = '',
    projectScope = '',
    targetTimeline = '',
    solutionCategories = [],
    phone = '',
    country = '',
    submittedAt = '',
    uploadedFiles = []
  } = data;

  const submissionDate = formatDate(submittedAt);
  const categories = Array.isArray(solutionCategories) ? solutionCategories.join(', ') : solutionCategories;
  const fileCount = Array.isArray(uploadedFiles) ? uploadedFiles.length : 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>RFQ Confirmation - Azaroth Tech-Hive</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a192f 0%, #1a365d 50%, #2c5282 100%); padding: 40px 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 1px;">AZAROTH TECH-HIVE</h1>
                    <p style="margin: 10px 0 0 0; color: #90cdf4; font-size: 14px; letter-spacing: 2px;">TECHNOLOGY. INNOVATION. SOLUTIONS.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent Line -->
          <tr>
            <td style="background-color: #4299e1; height: 4px;"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0; color: #2d3748; font-size: 16px;">Dear ${escapeHtml(fullName)},</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <h2 style="margin: 0 0 15px 0; color: #1a365d; font-size: 24px;">Your Quotation Request Has Been Received!</h2>
                    <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                      Thank you for submitting a Request for Quotation to Azaroth Tech-Hive. Your requirements have been received and will be reviewed by our team.
                    </p>
                  </td>
                </tr>

                <!-- Reference Number Card (Prominent) -->
                <tr>
                  <td style="padding: 30px; background: linear-gradient(135deg, #2c5282 0%, #2b6cb0 100%); border-radius: 6px; margin-bottom: 20px; text-align: center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #bee3f8; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">RFQ Reference Number</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px;">${escapeHtml(referenceId)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- RFQ Summary -->
                <tr>
                  <td style="padding: 25px; background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <h3 style="margin: 0; color: #1a365d; font-size: 16px; border-bottom: 2px solid #4299e1; padding-bottom: 8px;">Quotation Request Summary</h3>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Reference ID:</strong> ${escapeHtml(referenceId)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Customer Name:</strong> ${escapeHtml(fullName)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Company Name:</strong> ${escapeHtml(companyName)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Work Email:</strong> ${escapeHtml(workEmail)}</p>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Country:</strong> ${escapeHtml(country)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Project Scope:</strong> ${escapeHtml(projectScope)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Expected Timeline:</strong> ${escapeHtml(targetTimeline)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Solution Categories:</strong> ${escapeHtml(categories)}</p>
                        </td>
                      </tr>
                      ${fileCount > 0 ? `
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Attached Files:</strong> ${fileCount} file(s) uploaded</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${submissionDate ? `
                      <tr>
                        <td>
                          <p style="margin: 0; color: #718096; font-size: 13px;"><strong>Submission Date:</strong> ${escapeHtml(submissionDate)}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>

                <!-- Next Steps -->
                <tr>
                  <td style="padding-top: 25px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 20px; background-color: #fffaf0; border-left: 4px solid #ed8936; border-radius: 4px;">
                          <h4 style="margin: 0 0 10px 0; color: #c05621; font-size: 15px;">Next Steps</h4>
                          <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;">
                            Our team will review your requirements and contact you regarding the next steps.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Closing -->
                <tr>
                  <td style="padding-top: 30px;">
                    <p style="margin: 0; color: #4a5568; font-size: 15px;">Thank you for considering Azaroth Tech-Hive for your project.</p>
                    <p style="margin: 15px 0 0 0; color: #4a5568; font-size: 15px;">Best regards,<br><strong>Azaroth Tech-Hive Team</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a365d; padding: 30px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 15px;">
                    <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold;">AZAROTH TECH-HIVE</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <p style="margin: 0; color: #90cdf4; font-size: 12px;">
                      <a href="https://azaroth-techhive.com" style="color: #90cdf4; text-decoration: underline;">azaroth-techhive.com</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px;">
                    <p style="margin: 0; color: #90cdf4; font-size: 12px;">hello@azaroth-techhive.com</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; color: #718096; font-size: 11px;">&copy; ${new Date().getFullYear()} Azaroth Tech-Hive. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  renderContactConfirmationEmail,
  renderRfqConfirmationEmail
};
