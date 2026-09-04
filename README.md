# Aditya Anshu - Developer Portfolio

A single-page personal portfolio for Aditya Anshu, a student and product-minded software developer based in India. The site presents a dark, technical visual style focused on thoughtful design, resilient engineering, and quiet software craft.

## Website

The portfolio includes:

- A hero section introducing Aditya as a software developer, product thinker, and curious human.
- A profile section describing his approach to building software.
- Four working principles: systems thinking, product instinct, quiet craft, and open practice.
- A contact section with a GitHub link and a name/message form.

## Tech Stack

- Semantic HTML5
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- Vanilla JavaScript for the contact form confirmation
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) and [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) from Google Fonts

## Project Structure

```text
.
├── index.html    # Complete portfolio page
├── vercel.json   # Static Vercel configuration
└── README.md     # Project documentation
```

## Contact Form

The contact form currently prevents a real submission and displays a confirmation alert in the browser. It does not send email or store messages. Connect it to a form service or backend before using it for production contact requests.

## Deploy on Vercel

This is a static site with no build step.

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Import the repository in Vercel.
3. Use the `Other` framework preset.
4. Leave Build Command and Output Directory empty.
5. Deploy.

Vercel serves `index.html` from the project root. The included `vercel.json` enables clean URLs.
