# 🚀 Installation Guide

Welcome to your new Web App Template! This guide will walk you through installing and customizing this template on any standard web hosting (cPanel, Hostinger, GoDaddy, Netlify, etc.).

## 📦 What's Included?
- `build/` (The actual website files to upload)
- `config.json` (Your website's content and settings)
- `contact.php` (For shared hosting email forms)

---

## 🛠️ Option 1: Standard cPanel Hosting (Hostinger, Bluehost, GoDaddy)
This is the most common method. Since this app is compiled into lightning-fast static files, it works perfectly on any PHP/Apache server!

**Step 1: Edit your Content**
1. Open the `config.json` file in any text editor (like Notepad or VS Code).
2. Change the company name, phone numbers, and image URLs to your own.
3. Save the file.

**Step 2: Upload to your Server**
1. Log into your hosting account and open **File Manager** (or use FTP like FileZilla).
2. Navigate to your `public_html` folder.
3. Upload all the files inside the `build/` folder directly into `public_html`.

**Step 3: Activate the Contact Form (PHP)**
1. Open `contact.php` and change `$recipient_email = "your-email@domain.com";` to your actual email address.
2. The website will automatically use this PHP script to send you emails when visitors fill out the contact form!

---

## ☁️ Option 2: Modern Cloud Hosting (Vercel, Netlify, GitHub Pages)
If you prefer modern static hosting (which is often free!):

1. Edit your `config.json` file.
2. Drag and drop the `build/` folder into Netlify (app.netlify.com/drop).
3. Your site is live! *(Note: For the contact form to work here, you will need to swap the form endpoint to a free service like Formspree.io).*

---

## 🖼️ How to change images?
You do not need a database! Simply upload your images to a free host like ImgBB.com or directly to your server's `assets` folder, and paste the direct link into the `config.json` file.

## 🆘 Troubleshooting
- **Blank Page?** Ensure you uploaded the *contents* of the `build` folder, not the folder itself, into `public_html`.
- **Emails not sending?** Ensure your cPanel hosting has standard PHP `mail()` enabled.
