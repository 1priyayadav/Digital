export async function sendEmail(to: string, subject: string, body: string) {
  // Stub for assignment: In a production system this routes through Resend or Sendgrid API
  console.log('====== EMAIL NOTIFICATION TRIGGERED ======')
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${body}`)
  console.log('==========================================')
}
