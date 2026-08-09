"""One-page AstralForge AI Employee proposal PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
import os

OUT = os.path.join(os.path.dirname(__file__), "AstralForge-AI-Employee-Proposal.pdf")
LOGO = os.path.join(os.path.dirname(__file__), "..", "assets", "images", "logo-star.jpg")

W, H = A4
bg = HexColor("#050814")
cyan = HexColor("#5ee7ff")
muted = HexColor("#8b9bb4")
text = HexColor("#e8eef8")
card = HexColor("#0c1224")


def package_box(c, x, y, w, h, title, setup, month, lines, popular=False):
    c.setFillColor(card)
    c.setStrokeColor(cyan if popular else HexColor("#1a2744"))
    c.setLineWidth(1.5 if popular else 0.8)
    c.roundRect(x, y, w, h, 6, fill=1, stroke=1)
    if popular:
        c.setFillColor(cyan)
        c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(x + w / 2, y + h - 6 * mm, "MOST POPULAR")
    top = 12 * mm if popular else 8 * mm
    c.setFillColor(text)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x + 4 * mm, y + h - top, title)
    c.setFillColor(cyan)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x + 4 * mm, y + h - top - 7 * mm, setup)
    c.setFillColor(muted)
    c.setFont("Helvetica", 8)
    c.drawString(x + 4 * mm, y + h - top - 12 * mm, month)
    c.setFillColor(text)
    c.setFont("Helvetica", 7.5)
    ly = y + h - top - 20 * mm
    for line in lines:
        c.drawString(x + 4 * mm, ly, "- " + line)
        ly -= 4.2 * mm


def main():
    c = canvas.Canvas(OUT, pagesize=A4)
    c.setFillColor(bg)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(cyan)
    c.rect(0, H - 4 * mm, W, 4 * mm, fill=1, stroke=0)

    if os.path.exists(LOGO):
        try:
            c.drawImage(LOGO, 18 * mm, H - 32 * mm, width=16 * mm, height=16 * mm, mask="auto")
        except Exception:
            pass

    c.setFillColor(text)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(38 * mm, H - 22 * mm, "AstralForge")
    c.setFillColor(cyan)
    c.setFont("Helvetica", 9)
    c.drawString(38 * mm, H - 27 * mm, "AI Employees for UAE Businesses")
    c.setFillColor(muted)
    c.setFont("Helvetica", 7)
    c.drawString(38 * mm, H - 32 * mm, "In co-operation with Aradana Technologies · Qusais Industrial Area, Dubai")
    c.setFont("Helvetica", 8)
    c.drawRightString(W - 18 * mm, H - 20 * mm, "astralforgeae.com")
    c.drawRightString(W - 18 * mm, H - 25 * mm, "+971 50 580 4276")

    c.setFillColor(text)
    c.setFont("Helvetica-Bold", 17)
    c.drawString(18 * mm, H - 45 * mm, "Your Next Employee Doesn't Need a Desk.")
    c.setFillColor(muted)
    c.setFont("Helvetica", 10)
    c.drawString(18 * mm, H - 52 * mm, "We build AI employees that answer customer questions, qualify leads,")
    c.drawString(18 * mm, H - 57 * mm, "capture enquiries and automate repetitive conversations — 24/7.")

    c.setFillColor(cyan)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(18 * mm, H - 70 * mm, "WHAT YOU GET")
    c.setFillColor(text)
    c.setFont("Helvetica", 9)
    items = [
        "Answer FAQs: services, pricing, hours, locations, policies",
        "Qualify enquiries so your team focuses on real opportunities",
        "Capture name, WhatsApp/phone and requirements before the lead disappears",
        "Configured on YOUR business information (not a generic chatbot)",
        "Human handoff path when a person should take over",
    ]
    yy = H - 78 * mm
    for it in items:
        c.setFillColor(cyan)
        c.circle(20 * mm, yy + 1.2 * mm, 1.2 * mm, fill=1, stroke=0)
        c.setFillColor(text)
        c.drawString(24 * mm, yy, it)
        yy -= 6 * mm

    c.setFillColor(cyan)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(18 * mm, yy - 3 * mm, "PACKAGES (INITIAL OFFER — AED)")
    yy -= 10 * mm

    pw, ph = 85 * mm, 58 * mm
    package_box(
        c,
        18 * mm,
        yy - ph,
        pw,
        ph,
        "STARTER",
        "AED 999 setup",
        "AED 299 / month",
        [
            "One AI employee",
            "Business knowledge setup",
            "Website chat",
            "Lead capture",
            "Basic customization",
            "Basic monitoring",
        ],
    )
    package_box(
        c,
        18 * mm + pw + 6 * mm,
        yy - ph,
        pw,
        ph,
        "BUSINESS",
        "AED 1,999 setup",
        "AED 499 / month",
        [
            "Everything in Starter",
            "Custom workflows",
            "Advanced qualification",
            "Multiple conversation flows",
            "Priority support",
            "Basic analytics",
        ],
        popular=True,
    )

    yy = yy - ph - 8 * mm
    c.setFillColor(muted)
    c.setFont("Helvetica", 7.5)
    c.drawString(
        18 * mm,
        yy,
        "Custom / multi-location / CRM: let's talk. Third-party tools may have separate costs.",
    )

    yy -= 10 * mm
    c.setFillColor(cyan)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(18 * mm, yy, "HOW IT WORKS")
    yy -= 7 * mm
    c.setFillColor(text)
    c.setFont("Helvetica", 8.5)
    for s in [
        "1. Tell us about your business (website, FAQs, services, policies)",
        "2. We build your AI employee around your workflows",
        "3. You test conversations and request changes",
        "4. Launch on the agreed channel — designed for rapid implementation",
    ]:
        c.drawString(18 * mm, yy, s)
        yy -= 5 * mm

    c.setFillColor(HexColor("#0a1828"))
    c.setStrokeColor(cyan)
    c.roundRect(18 * mm, 22 * mm, W - 36 * mm, 28 * mm, 6, fill=1, stroke=1)
    c.setFillColor(cyan)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(24 * mm, 42 * mm, "NEXT STEP")
    c.setFillColor(text)
    c.setFont("Helvetica", 9)
    c.drawString(
        24 * mm,
        35 * mm,
        "1) Live demo  2) Request AI employee  3) Pay setup  4) We configure on your FAQs",
    )
    c.setFillColor(cyan)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(
        24 * mm,
        28 * mm,
        "https://astralforgeae.com/  |  WhatsApp +971 50 580 4276  |  astralfconsulting@gmail.com",
    )

    c.setFillColor(muted)
    c.setFont("Helvetica", 7)
    c.drawCentredString(
        W / 2,
        12 * mm,
        "Illustrative proposal — not a guarantee of revenue. AI needs human oversight where appropriate. (c) 2026 AstralForge",
    )

    c.save()
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
