import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    console.log("[v0] Sending email to:", to, "subject:", subject)

    if (!process.env.RESEND_API_KEY) {
      console.warn("[v0] RESEND_API_KEY not configured, skipping email send")
      return { success: false, error: "Email service not configured" }
    }

    const result = await resend.emails.send({
      from: "IV Volunteers <onboarding@resend.dev>", // Resend's test domain
      to,
      subject,
      html,
    })

    console.log("[v0] Email sent successfully:", result)
    return { success: true, data: result }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

export function getApplicationConfirmationEmail(data: {
  applicantName: string
  opportunityTitle: string
  hostOrganization: string
}) {
  return {
    subject: `Application Received: ${data.opportunityTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Received</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Application Received!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.applicantName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for applying to <strong>${data.opportunityTitle}</strong> with <strong>${data.hostOrganization}</strong>!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">
                Your application has been successfully submitted and is now under review. The host organization will review your application and get back to you soon.
              </p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              You can track the status of your application by logging into your dashboard.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                View Dashboard
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Best regards,<br>
              <strong>The IV Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </body>
      </html>
    `,
  }
}

export function getApplicationStatusEmail(data: {
  applicantName: string
  opportunityTitle: string
  hostOrganization: string
  status: "approved" | "rejected"
  message?: string
}) {
  const isApproved = data.status === "approved"

  return {
    subject: `Application ${isApproved ? "Approved" : "Update"}: ${data.opportunityTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Status Update</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${isApproved ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">
              ${isApproved ? "Congratulations!" : "Application Update"}
            </h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.applicantName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We have an update regarding your application to <strong>${data.opportunityTitle}</strong> with <strong>${data.hostOrganization}</strong>.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${isApproved ? "#10b981" : "#667eea"}; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px; font-weight: 600; color: ${isApproved ? "#10b981" : "#667eea"};">
                ${isApproved ? "Your application has been approved!" : "Application Status Update"}
              </p>
              ${data.message ? `<p style="margin-top: 15px; font-size: 16px;">${data.message}</p>` : ""}
            </div>
            
            ${
              isApproved
                ? `
              <p style="font-size: 16px; margin-bottom: 20px;">
                The host organization will contact you directly with next steps and additional information about your volunteer opportunity.
              </p>
            `
                : `
              <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for your interest. We encourage you to explore other opportunities that might be a great fit for you.
              </p>
            `
            }
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                View Dashboard
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Best regards,<br>
              <strong>The IV Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </body>
      </html>
    `,
  }
}

export function getWelcomeEmail(data: { name: string; email: string }) {
  return {
    subject: "Welcome to IV - International Volunteers",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to IV</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to IV!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.name || "Volunteer"},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Welcome to <strong>International Volunteers (IV)</strong>! We're excited to have you join our community of passionate volunteers making a difference around the world.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #667eea; font-size: 20px;">Getting Started</h2>
              <ul style="padding-left: 20px; margin: 15px 0;">
                <li style="margin-bottom: 10px;">Complete your profile to help organizations get to know you</li>
                <li style="margin-bottom: 10px;">Browse available volunteer opportunities</li>
                <li style="margin-bottom: 10px;">Apply to opportunities that match your interests</li>
                <li style="margin-bottom: 10px;">Track your applications in your dashboard</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/opportunities" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-right: 10px;">
                Browse Opportunities
              </a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profile" 
                 style="background: white; color: #667eea; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; border: 2px solid #667eea;">
                Complete Profile
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you have any questions, feel free to reach out to our support team.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              Best regards,<br>
              <strong>The IV Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </body>
      </html>
    `,
  }
}
