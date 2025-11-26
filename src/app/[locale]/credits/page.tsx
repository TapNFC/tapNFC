import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credits & Licenses',
};

type CreditsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CreditsPage(_props: CreditsPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-sm text-slate-900 dark:text-slate-100">
      <h2 className="border-b-2 border-slate-800 pb-2 text-2xl font-semibold text-slate-900 dark:border-slate-200 dark:text-slate-50">
        Credits &amp; Licenses
      </h2>
      <p className="mt-4">
        Our platform uses open-source, public domain, and official brand resources to deliver high-quality icons and graphics.
      </p>

      {/* MIT Licensed Collections */}
      <h3 className="mt-9 text-lg font-semibold text-slate-800 dark:text-slate-100">
        MIT Licensed Collections
      </h3>
      <ul className="mt-3 list-none space-y-1 pl-0">
        <li>
          Basicons Interface Line Icons — © Basicons —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Line Awesome — © Icons8 —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Instructure UI Line Interface Icons — © instructure-ui —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Orchid Line Interface Icons — © Orchid —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Atlas Variety Line Icons — © Vectopus —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Flexicon Sharp Interface Glyphs — © blivesta —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Element Plus Line Interface Icons — © element-plus —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Software Mansion Line Icons — © Software Mansion —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Industrial Sharp UI Icons — © Siemens —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Denali Solid Interface Icons — © Denali Design —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Neuicons Oval Solid Icons — © Neuicons —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Scarlab Oval Line Icons — © scarlab —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Tiny App Icons — © edent —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Licons Oval Line Interface Icons — © Klever Space —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Shopicon Line Icons — © H2D2 Design —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Primeng Interface Icons — © primefaces —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
        <li>
          Emojione Mono Emojis — © JoyPixels —
          {' '}
          <a href="https://opensource.org/licenses/MIT" className="text-blue-600 hover:underline dark:text-blue-400">
            MIT License
          </a>
        </li>
      </ul>

      <pre className="mt-3 whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        {`MIT License

Copyright (c) [original authors/copyright holders]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`}
      </pre>

      <hr className="my-7 border-slate-200 dark:border-slate-700" />

      {/* Apache Licensed Collections */}
      <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Apache Licensed Collections
      </h3>
      <ul className="mt-3 list-none space-y-1 pl-0">
        <li>
          Decathlon Payment Vectors — © Decathlon —
          {' '}
          <a href="https://www.apache.org/licenses/LICENSE-2.0" className="text-blue-600 hover:underline dark:text-blue-400">
            Apache License 2.0
          </a>
          {' '}
          — Modifications made by Tap NFC where applicable
        </li>
        <li>
          Lawnicons Line Brand Icons — © lawnchairlauncher —
          {' '}
          <a href="https://www.apache.org/licenses/LICENSE-2.0" className="text-blue-600 hover:underline dark:text-blue-400">
            Apache License 2.0
          </a>
          {' '}
          — Modifications made by Tap NFC where applicable
        </li>
      </ul>

      <pre className="mt-3 whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        {`Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.
"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.
"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.
"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity.
"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.
"Source" form shall mean the preferred form for making modifications.
"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form.
"Work" shall mean the work of authorship being licensed under this License.
"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work.
"Contribution" shall mean any work of authorship submitted by You to the Licensor for inclusion in the Work.
"Contributor" shall mean the Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received.

2. Grant of Copyright License.
Subject to the terms and conditions of this License, each Contributor hereby grants You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License.
Subject to the terms and conditions of this License, each Contributor hereby grants You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work.

4. Redistribution.
You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:
(a) You must give any other recipients of the Work or Derivative Works a copy of this License; and
(b) You must cause any modified files to carry prominent notices stating that You changed the files; and
(c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices; and
(d) If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file; and
(e) You must not use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

5. Submission of Contributions.
Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor for inclusion in the Work shall be under the terms and conditions of this License.

6. Trademarks.
This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work.

7. Disclaimer of Warranty.
Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

8. Limitation of Liability.
In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages arising from the use or inability to use the Work.

9. Accepting Warranty or Additional Liability.
While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License.

END OF TERMS AND CONDITIONS`}
      </pre>

      <hr className="my-7 border-slate-200 dark:border-slate-700" />

      {/* CC0 / Public Domain Collections */}
      <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100">
        CC0 / Public Domain Collections
      </h3>
      <ul className="mt-3 list-none space-y-1 pl-0">
        <li>Objects Infographic Icons — CC0 — SVG Repo</li>
        <li>Kalai Oval Interface Icons — Public Domain — Ananthanath A X Kalaiism</li>
        <li>Wave Oval Interface Icons — Public Domain — Arthur Kazais</li>
        <li>Humans Resources — CC0 — SVG Repo</li>
        <li>Trading — CC0 — SVG Repo</li>
        <li>Communication Icooon Mono Vectors — Public Domain — Icooon Mono</li>
        <li>Social Media Logos 2 — CC0 — SVG Repo</li>
        <li>Lodgicons — CC0 — SVG Repo</li>
        <li>Items And Tools Icooon Mono Vectors — Public Domain — Icooon Mono</li>
      </ul>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
        (No attribution required for CC0/PD collections.)
      </p>

      <hr className="my-7 border-slate-200 dark:border-slate-700" />

      {/* Official Brand Logos */}
      <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100">
        Official Brand Logos
      </h3>
      <ul className="mt-3 list-none space-y-1 pl-0">
        <li>
          Google App Logos — © Google —
          {' '}
          <a href="https://about.google/brand-resource-center/logos-list" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Google Maps &amp; Reviews Logos — © Google —
          {' '}
          <a href="https://about.google/brand-resource-center/logos-list" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Google Cloud Solutions Icons — © Google Cloud —
          {' '}
          <a href="https://cloud.google.com/icons" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>

        <li>
          Meta Logos (Facebook, Instagram, Messenger, WhatsApp) — © Meta —
          {' '}
          <a href="https://about.meta.com/brand/resources/" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Snapchat Logo — © Snap Inc. —
          {' '}
          <a href="https://www.snap.com/brand-guidelines" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          YouTube Logo — © Google —
          {' '}
          <a href="https://brand.youtube/" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          LinkedIn Logo — © LinkedIn —
          {' '}
          <a href="https://brand.linkedin.com/" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          TikTok Logo — © TikTok —
          {' '}
          <a href="https://www.tiktok.com/business/brand-resources" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Pinterest Logo — © Pinterest —
          {' '}
          <a href="https://business.pinterest.com/brand-guidelines/" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Telegram Logo — © Telegram — (Brand Guidelines)
        </li>

        <li>
          Apple Music &amp; Apple Pay Logos — © Apple —
          {' '}
          <a href="https://marketing.services.apple/apple-music-identity-guidelines" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Spotify Logo — © Spotify —
          {' '}
          <a href="https://developer.spotify.com/documentation/design" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          SoundCloud Logo — © SoundCloud —
          {' '}
          <a href="https://developers.soundcloud.com/docs/api/buttons-logos" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>

        <li>
          PayPal Logo — © PayPal —
          {' '}
          <a href="https://newsroom.paypal-corp.com/media-resources" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Cash App Logo — © Block, Inc. —
          {' '}
          <a href="https://cash.app/brand" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Venmo Logo — © PayPal —
          {' '}
          <a href="https://venmo.com/about/brand/" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          WeChat Logo — © Tencent —
          {' '}
          <a href="https://newsroom.wechat.com/newsRooms/BrandingGuidelines" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          TripAdvisor Logo — © TripAdvisor —
          {' '}
          <a href="https://www.tripadvisor.com/pdfs/cprc/BrandGuidelinesForPartners.pdf" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>

        <li>
          Mastercard Logo — © Mastercard —
          {' '}
          <a href="https://brand.mastercard.com/brandcenter/" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          American Express Logo — © American Express —
          {' '}
          <a href="https://www.americanexpress.com/us/company/brand/" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Visa Logo — © Visa —
          {' '}
          <a href="https://usa.visa.com/about-visa/brand.html" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>

        <li>
          Yelp Logo — © Yelp —
          {' '}
          <a href="https://www.yelp.com/brand" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
        <li>
          Discord Logo — © Discord Inc. —
          {' '}
          <a href="https://discord.com/branding" className="text-blue-600 hover:underline dark:text-blue-400">
            Brand Guidelines
          </a>
        </li>
      </ul>

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
        Usage Note (applies to all official brand logos): These logos are trademarked assets. They may only be used in accordance
        with each company&apos;s Brand Guidelines. Logos must not be altered, recolored, or used decoratively. They are permitted
        solely for linking to official platform pages.
      </p>
    </main>
  );
}
