IAS FLORIDA WEBSITE — HOUSECALL PRO SETUP
(For Housecall Pro support or anyone installing Housecall Pro on this site)
==========================================================================

ABOUT THIS WEBSITE
- Plain HTML / CSS / JavaScript site (not Wix, Squarespace or WordPress).
- Hosted on GitHub Pages from the repository iceboxairsystems/IAS-Florida-8.
- Every page loads one shared file: housecall-pro.js
  That is the ONLY file that needs to change to connect Housecall Pro.


WHAT WE NEED FROM HOUSECALL PRO
1. Online Booking code for our website (the script + "Book online" button
   code), or our online booking link.
     Housecall Pro: Marketing > Online Booking
2. Lead Form embed code (optional).
     Housecall Pro: Settings > Leads > Share lead form > Copy code
3. Website chat bubble code (optional), so CSR AI Chat can answer website
   chats. Turn on CSR AI Chat in Team > AI Team > CSR AI.


HOW TO INSTALL (about 2 minutes)
1. Open housecall-pro.js
2. Paste the Online Booking code, exactly as copied, between the two
   backticks ( ` ` ) after   booking:
3. (Optional) Paste the Lead Form code between the backticks after
   leadForm:
   (Optional) Paste the website chat bubble code between the backticks
   after   chat:   It loads on every page.
   (Already done) The Customer Portal code goes between the backticks
   after   portal:   Paste the whole button code or just the link.
4. Save and upload / commit that one file. Nothing else needs to change.

Pasted code can be a <script> tag, a <button>, an embed block (iframe/div)
or a plain https:// link. The file detects which kind it is.


WHAT HAPPENS AUTOMATICALLY
- Every "Book online" button on every page (header, hero, mobile bar,
  service pages, footer, call-to-action boxes) calls
  HCPWidget.openModal() once the Housecall Pro script is loaded.
  If only a link is provided, the buttons open that link in a new tab.
- book.html shows the embedded booking widget if the code includes one;
  otherwise it opens the Housecall Pro pop-up by itself and shows a
  button to reopen it. Any page address ending in ?booking also opens it.
- If the pop-up can't load (ad blocker, very slow connection), the
  buttons open the same Housecall Pro booking page
  (book.housecallpro.com/book/<orgName>/<token>) in a new tab, built
  from the pasted code. Bookings land in Housecall Pro either way.
- Lead Form code replaces the estimate request forms on index.html (top of
  the home page) and contact.html. plans.html keeps its own form because
  it sends the plans the customer selected.
- While nothing is pasted, booking falls back to Calendly.
- The portal link powers "Log in" in the header, "Customer
  portal" in the phone menu and footer, and the FAQ answer about
  invoices. Empty the portal box to hide all of those links.


HOW TO CHECK IT WORKS
Open the site with  ?hcp-check  at the end of the address, for example:
  https://iceboxairsystems.github.io/IAS-Florida-8/?hcp-check
A small box appears and reports what was detected (booking script,
pop-up ready, lead form).


IF YOU PREFER TO INSTALL ANOTHER WAY
- Booking buttons: any element with the attribute  data-book
- Lead form spots: elements with  data-hcp-lead-slot
  (the form goes inside the child  data-hcp-lead-target)
- Booking area on book.html:  #booking  (data-hcp-booking-slot)
- You can also put your <script> tag in the <head> of each page; the
  buttons detect window.HCPWidget on their own.


CONTACT
IAS Florida · (786) 372-7744 · jobs@iasflorida.com
