const nodemailer = require('nodemailer');

/**
 * Sends a booking confirmation email to the user.
 * @param {Object} bookingData - Contains user, movie, theater, show, seats, totalAmount, and bookingId.
 */
const sendTicketEmail = async (bookingData) => {
    // Create a transporter using environment variables
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { user, movie, theater, show, seats, totalAmount, bookingId } = bookingData;

    // Email content with HTML branding
    const mailOptions = {
        from: `MovieBooking <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: `🎬 Booking Confirmed Boss: ${movie.title}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #e50914 0%, #b20710 100%); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">Booking Confirmed!</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">See you at the cinema!</p>
                </div>
                
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
                    <p style="font-size: 15px; color: #555; line-height: 1.5;">Your reservation for <strong>${movie.title}</strong> is confirmed. Below are your ticket details:</p>
                    
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #e50914;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #777;">Theater</td>
                                <td style="padding: 8px 0; text-align: right; color: #333;"><strong>${theater.name}</strong><br><span style="font-size: 12px; color: #888;">${theater.location}</span></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #777;">Show Date & Time</td>
                                <td style="padding: 8px 0; text-align: right; color: #333;">${new Date(show.showTime).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #777;">Seats</td>
                                <td style="padding: 8px 0; text-align: right; color: #e50914;"><strong>${seats.join(', ')}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 15px 0 8px; color: #777; border-top: 1px dashed #ddd;">Total Paid</td>
                                <td style="padding: 15px 0 8px; text-align: right; color: #333; border-top: 1px dashed #ddd; font-size: 18px;"><strong>₹${totalAmount}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #aaa; font-size: 11px;">Booking ID</td>
                                <td style="padding: 8px 0; text-align: right; color: #aaa; font-size: 11px;">#${bookingId}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="font-size: 14px; color: #888;">Kindly present this email at the box office.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #e50914; font-weight: bold; margin: 0;">Enjoy your movie experience!</p>
                    </div>
                </div>
                
                <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    <p style="margin: 0;">This is an automated confirmation from MovieBooking System.</p>
                    <p style="margin: 5px 0 0;">© 2026 MovieBooking. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Ticket email sent successfully to ${user.email}`);
    } catch (error) {
        console.error('[EmailService] Error sending ticket email:', error);
        // We don't necessarily want to crash the booking process if email fails, 
        // but we throw it so the controller can handle/log it.
        throw error;
    }
};

module.exports = { sendTicketEmail };
