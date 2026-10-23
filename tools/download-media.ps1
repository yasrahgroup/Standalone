$ProgressPreference = 'SilentlyContinue'

$downloads = @(
    @{ Path = "public\images\products\fms-cover.jpg"; Url = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80" },
    @{ Path = "public\images\products\commerce-cover.jpg"; Url = "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80" },
    @{ Path = "public\images\products\lmp-cover.jpg"; Url = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" },
    @{ Path = "public\images\products\hms-cover.jpg"; Url = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" },
    @{ Path = "public\images\about\team-collaboration.jpg"; Url = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
    @{ Path = "public\images\about\tech-headquarters.jpg"; Url = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" },
    @{ Path = "public\images\industries\retail.jpg"; Url = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\industries\education.jpg"; Url = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\industries\healthcare.jpg"; Url = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\industries\supplychain.jpg"; Url = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\industries\erp.jpg"; Url = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\insights\streaming-architecture.jpg"; Url = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\insights\enterprise-ai.jpg"; Url = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\insights\cloud-modernization.jpg"; Url = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    @{ Path = "public\images\testimonials\director-vaken.jpg"; Url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&h=250&q=80" },
    @{ Path = "public\images\testimonials\ceo-tontine.jpg"; Url = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&h=250&q=80" },
    @{ Path = "public\images\testimonials\founder-startup.jpg"; Url = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&h=250&q=80" }
)

foreach ($item in $downloads) {
    try {
        $parent = Split-Path $item.Path -Parent
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Force -Path $parent | Out-Null
        }
        Invoke-WebRequest -Uri $item.Url -OutFile $item.Path -TimeoutSec 20
        Write-Host "Success: $($item.Path) ($((Get-Item $item.Path).Length) bytes)"
    } catch {
        Write-Warning "Failed: $($item.Path) - $($_.Exception.Message)"
    }
}
