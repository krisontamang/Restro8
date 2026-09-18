// Supabase Edge Function: notify-signup
// Welcomes new users with their 14-day trial activation and alerts the admin team
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const userEmail = payload?.record?.email || payload?.email || "Unknown User";
    const provider = payload?.record?.app_metadata?.provider || payload?.provider || "email";
    const workspaceName = payload?.workspaceName || "Your Restaurant";
    const createdAt = payload?.record?.created_at || payload?.timestamp || new Date().toISOString();
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || payload?.adminEmail || "krisonlama27@gmail.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supportPhone = "9821828807";
    const supportWhatsApp = "https://wa.me/9779821828807?text=Hi%20Restro8%20Team%2C%20I%20have%20feedback%20%2F%20found%20a%20bug%20in%20my%20workspace";

    console.log(`[Restro8] New registration: ${userEmail} (${provider}) - 14-day trial activated.`);

    if (resendApiKey) {
      // 1. Welcome and notify the user
      const userEmailPromise = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Restro8 Team <welcome@restro8.com>",
          to: [userEmail],
          subject: "🎉 Welcome to Restro8! Your 14-day free trial is active",
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fafbf7; color: #243d33; padding: 32px 24px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #dde2d8;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #526a57; text-transform: uppercase;">WELCOME TO RESTRO8</span>
                <h1 style="color: #285d49; font-size: 26px; margin: 8px 0 16px;">Your 14-Day Free Trial is Active!</h1>
                <p style="font-size: 15px; line-height: 1.6; color: #44544b;">
                  Welcome to Restro8, built for thoughtful, calm restaurant operations. We’re delighted to have you on board with <strong>${workspaceName}</strong>.
                </p>
              </div>

              <div style="background: #ffffff; border: 1px solid #dde2d8; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin-top: 0; color: #285d49; font-size: 16px;">What's included in your trial:</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #44544b;">
                  <li><strong>Fast POS Terminal:</strong> Take dine-in, takeaway, and delivery orders.</li>
                  <li><strong>Kitchen Display (KDS):</strong> Real-time KOT tickets and order progress.</li>
                  <li><strong>Visual Floor Plan:</strong> Interactive table layout and guest tracking.</li>
                  <li><strong>Inventory & Reports:</strong> Recipe batching, consumption, and sales summaries.</li>
                </ul>
              </div>

              <div style="background: #eef3ea; border: 1px solid #cddbc4; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin-top: 0; color: #285d49; font-size: 16px;">💡 Help us improve — Report bugs & suggestions</h3>
                <p style="font-size: 14px; line-height: 1.6; color: #3c5443; margin-bottom: 16px;">
                  We are constantly improving Restro8. If you notice any bugs, glitches, or have feature ideas for your restaurant, reach out directly to our founding support team:
                </p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                  <a href="${supportWhatsApp}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px;">
                    💬 WhatsApp Support: ${supportPhone}
                  </a>
                  <a href="mailto:${adminEmail}?subject=Restro8%20Feedback%20%26%20Bug%20Report" style="display: inline-block; background: #285d49; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px;">
                    ✉️ Email: ${adminEmail}
                  </a>
                </div>
              </div>

              <p style="font-size: 13px; color: #657068; margin-top: 24px;">
                With warm hospitality,<br>
                <strong>The Restro8 Team</strong><br>
                Kathmandu, Nepal
              </p>
            </div>
          `,
        }),
      });

      // 2. Alert the admin team
      const adminEmailPromise = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Restro8 System <alerts@restro8.com>",
          to: [adminEmail],
          subject: `🍽️ New Restro8 Registration & Trial: ${userEmail}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; background: #fafbf7; color: #243d33;">
              <h2 style="color: #285d49;">New Restro8 Registration</h2>
              <p>A new restaurant owner just registered with an active 14-day trial.</p>
              <table style="margin-top: 16px; border-collapse: collapse; width: 100%; max-width: 500px;">
                <tr><td style="padding: 8px 0; font-weight: bold;">User Email:</td><td>${userEmail}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Workspace:</td><td>${workspaceName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Method:</td><td>${provider}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Registered At:</td><td>${createdAt}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Trial Duration:</td><td>14 Days Active</td></tr>
              </table>
              <p style="margin-top: 24px; font-size: 12px; color: #657068;">Restro8 Notification System</p>
            </div>
          `,
        }),
      });

      await Promise.allSettled([userEmailPromise, adminEmailPromise]);

      return new Response(JSON.stringify({ success: true, userEmail, adminEmail }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // When RESEND_API_KEY is not configured, record and simulate the welcome event
    return new Response(
      JSON.stringify({
        success: true,
        welcomeEmail: {
          to: userEmail,
          subject: "🎉 Welcome to Restro8! Your 14-day free trial is active",
          trialDays: 14,
          supportWhatsApp: supportPhone,
          supportEmail: adminEmail,
        },
        adminNotification: {
          to: adminEmail,
          registeredUser: userEmail,
          provider,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
