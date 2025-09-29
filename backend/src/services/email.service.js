import nodemailer from 'nodemailer';

/**
 * Test SMTP connection
 * @returns {Promise<boolean>} Connection test result
 */
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    const result = await transporter.verify();
    console.log('SMTP connection test successful:', result);
    return true;
  } catch (error) {
    console.error('SMTP connection test failed:', {
      error: error.message,
      code: error.code,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER
    });
    return false;
  }
};

// Create transporter using environment variables
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT);
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Additional Gmail-specific settings
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
  });
};

/**
 * Send booking confirmation email to guest
 * @param {object} booking - Booking details
 * @param {object} property - Property details
 * @param {object} guest - Guest details
 * @returns {Promise<object>} Email sending result
 */
export const sendBookingConfirmationEmail = async (booking, property, guest) => {
  try {
    const transporter = createTransporter();

    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ff5a5f; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .booking-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; }
          .value { margin-left: 10px; }
          .total { font-size: 18px; font-weight: bold; color: #ff5a5f; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your reservation has been successfully processed</p>
          </div>
          
          <div class="content">
            <h2>Hello ${guest.firstName}!</h2>
            <p>Great news! Your booking has been confirmed and payment has been processed successfully.</p>
            
            <div class="booking-details">
              <h3>📍 Property Details</h3>
              <div class="detail-row">
                <span class="label">Property:</span>
                <span class="value">${property.title}</span>
              </div>
              <div class="detail-row">
                <span class="label">Address:</span>
                <span class="value">${property.address.street}, ${property.address.city}, ${property.address.state}</span>
              </div>
              
              <h3>📅 Booking Details</h3>
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">${booking._id}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-in:</span>
                <span class="value">${checkInDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-out:</span>
                <span class="value">${checkOutDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Guests:</span>
                <span class="value">${booking.numberOfGuests}</span>
              </div>
              <div class="detail-row">
                <span class="label">Nights:</span>
                <span class="value">${booking.numberOfNights}</span>
              </div>
              
              <h3>💰 Payment Summary</h3>
              <div class="detail-row">
                <span class="label">Subtotal:</span>
                <span class="value">$${booking.subtotal}</span>
              </div>
              ${booking.cleaningFee > 0 ? `
              <div class="detail-row">
                <span class="label">Cleaning Fee:</span>
                <span class="value">$${booking.cleaningFee}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="label">Service Fee:</span>
                <span class="value">$${booking.serviceFee}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tax:</span>
                <span class="value">$${booking.taxAmount}</span>
              </div>
              <div class="detail-row total">
                <span class="label">Total Paid:</span>
                <span class="value">$${booking.totalAmount}</span>
              </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Save this confirmation email for your records</li>
              <li>Contact the host if you have any questions</li>
              <li>Arrive at the property during check-in hours</li>
            </ul>
            
            <p>We hope you have a wonderful stay!</p>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing our platform!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: guest.email,
      subject: `Booking Confirmation - ${property.title}`,
      html: emailHTML,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Guest confirmation email sent successfully:', result.messageId);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Email sending error - Guest confirmation:', {
      error: error.message,
      code: error.code,
      command: error.command,
      to: guest.email,
      from: process.env.EMAIL_FROM
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send booking notification email to host
 * @param {object} booking - Booking details
 * @param {object} property - Property details
 * @param {object} host - Host details
 * @param {object} guest - Guest details
 * @returns {Promise<object>} Email sending result
 */
export const sendHostNotificationEmail = async (booking, property, host, guest) => {
  try {
    const transporter = createTransporter();

    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .booking-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; }
          .value { margin-left: 10px; }
          .earnings { font-size: 18px; font-weight: bold; color: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Booking Received!</h1>
            <p>You have a new reservation for your property</p>
          </div>
          
          <div class="content">
            <h2>Hello ${host.firstName}!</h2>
            <p>Great news! You've received a new booking for your property "${property.title}".</p>
            
            <div class="booking-details">
              <h3>👤 Guest Information</h3>
              <div class="detail-row">
                <span class="label">Guest Name:</span>
                <span class="value">${guest.firstName} ${guest.lastName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${guest.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${guest.phone || 'Not provided'}</span>
              </div>
              
              <h3>📅 Booking Details</h3>
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">${booking._id}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-in:</span>
                <span class="value">${checkInDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-out:</span>
                <span class="value">${checkOutDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Number of Guests:</span>
                <span class="value">${booking.numberOfGuests}</span>
              </div>
              <div class="detail-row">
                <span class="label">Nights:</span>
                <span class="value">${booking.numberOfNights}</span>
              </div>
              
              ${booking.specialRequests ? `
              <h3>📝 Special Requests</h3>
              <p>${booking.specialRequests}</p>
              ` : ''}
              
              <div class="detail-row earnings">
                <span class="label">Your Earnings:</span>
                <span class="value">$${booking.totalAmount}</span>
              </div>
            </div>
            
            <p><strong>Action Required:</strong></p>
            <ul>
              <li>Prepare your property for the guest's arrival</li>
              <li>Review any special requests</li>
              <li>Ensure check-in instructions are clear</li>
              <li>Contact the guest if needed</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Manage your bookings in your host dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: host.email,
      subject: `New Booking - ${property.title} (${checkInDate})`,
      html: emailHTML,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Host notification email sent successfully:', result.messageId);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Host notification email error:', {
      error: error.message,
      code: error.code,
      command: error.command,
      to: host.email,
      from: process.env.EMAIL_FROM
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send booking cancellation email
 * @param {object} booking - Booking details
 * @param {object} property - Property details
 * @param {object} user - User details
 * @param {string} reason - Cancellation reason
 * @returns {Promise<object>} Email sending result
 */
export const sendCancellationEmail = async (booking, property, user, reason) => {
  try {
    const transporter = createTransporter();

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Cancellation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Your booking for "${property.title}" has been cancelled.</p>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Booking Cancellation - ${property.title}`,
      html: emailHTML,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Cancellation email error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  sendBookingConfirmationEmail,
  sendHostNotificationEmail,
  sendCancellationEmail,
};