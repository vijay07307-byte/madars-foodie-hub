export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Terms & Conditions</h1>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to MADRAS FOODIE, the official college canteen food ordering application.
              By using this app, you agree to comply with and be bound by the following terms
              and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">2. Ordering & Payment</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              All orders placed through MADRAS FOODIE are subject to availability. We accept
              the following payment methods:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>UPI (Google Pay, PhonePe, etc.)</li>
              <li>Credit/Debit Cards</li>
              <li>Cash at counter</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">3. Order Cancellation</h2>
            <p className="text-gray-600 leading-relaxed">
              Orders can be cancelled before they are confirmed by the canteen. Once the order
              is in preparation, cancellation may not be possible. Please contact the canteen
              directly for any urgent changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">4. Food Quality & Safety</h2>
            <p className="text-gray-600 leading-relaxed">
              All food items are prepared following strict hygiene and quality standards. If you
              have any allergies or dietary restrictions, please inform the canteen staff before
              placing your order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">5. Delivery Time</h2>
            <p className="text-gray-600 leading-relaxed">
              Estimated preparation times are approximate and may vary depending on order volume.
              You will be notified when your order is ready for pickup.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">6. Discounts & Offers</h2>
            <p className="text-gray-600 leading-relaxed">
              All discounts, offers, and combos are subject to availability and may change without
              prior notice. Discounts cannot be combined unless explicitly stated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">7. User Conduct</h2>
            <p className="text-gray-600 leading-relaxed">
              Users are expected to use the app responsibly. Any misuse, including false orders
              or harassment of canteen staff, may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">8. Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              We respect your privacy and handle your personal information securely. Your data
              is used only for order processing and improving our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">9. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For any questions, concerns, or feedback, please contact the canteen management
              through the app or visit the canteen counter during operating hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">10. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these terms and conditions at any time. Continued
              use of the app after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-gray-500 text-sm">
              Last updated: November 2025
            </p>
            <p className="text-gray-500 text-sm mt-2">
              © 2025 MADRAS FOODIE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
