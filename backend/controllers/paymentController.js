const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Creates a Razorpay Order
 */
const createOrder = async (req, res) => {
    try {
        // Validation to ensure keys are not placeholders
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        // Validation to ensure keys are not missing or placeholders
        if (!keyId || !keySecret || 
            keyId.includes('PASTE') || 
            keySecret.includes('PASTE')) {
            throw new Error("Razorpay API keys are not correctly configured in .env file");
        }

        console.log(`[DEBUG] Attempting Razorpay Order. Amount: ${req.body.amount}, Key ID: ${keyId}`);
        
        const instance = new Razorpay({
            key_id: keyId.trim(),
            key_secret: keySecret.trim(),
        });

        const options = {
            amount: Math.round(Number(req.body.amount) * 100), // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured while creating order");

        res.json(order);
    } catch (error) {
        console.error("--- RAZORPAY ERROR ---");
        console.error("Status Code:", error.statusCode);
        console.error("Error Description:", error.error ? error.error.description : error.message);
        console.error("Full Error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Verifies the Razorpay Payment Signature
 */
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, verifyPayment };
