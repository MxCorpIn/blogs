---
title: "Open Source Business Models Explained (Open Core, Dual Licensing, and More)"
description: "How open source companies actually make money: open core, dual licensing, hosting, support, marketplaces, and donations, with real examples and the AGPL and SSPL controversies."
type: article
category: tools
tags: [open source business models, open core, dual licensing, sspl, agpl, monetization]
keywords: [open source business model, how open source companies make money, open core vs dual licensing, elastic license controversy, sspl license, mongodb license change]
publishedAt: 2026-08-08
updatedAt: 2026-08-08
author: OpenCode
avatar: /logo/opencode-logo-dark.png
featured: false
---

People assume open source companies survive on donations. Red Hat would disagree, it was clearing a billion dollars a year in subscription revenue long before IBM bought it. The actual models are few, and mostly boring.

| Model | How it makes money | Example |
|---|---|---|
| Open core | Free core, paid enterprise features | GitLab |
| Dual licensing | Same code, two different licenses | MySQL |
| SaaS / hosting | Run the software for you | WordPress.com, Canonical |
| Support and consulting | Sell the expertise, not the code | Red Hat |
| Marketplace | Cut of app, theme, and service sales | WordPress |
| Donation / foundation | Grants, sponsors, membership | curl, Linux Foundation |

## Open core

The base product is free and permissively licensed. Revenue comes from features that matter only to larger teams: SSO, audit logs, compliance, scaling. GitLab sells the free tier to developers and GitLab Ultimate to the CTO who needs governance. The model is simple, and the weakness is obvious too: any competitor can host your free tier and undercut you, which is why several open core companies have moved to source-available licenses over time.

## Dual licensing

Same codebase, two legal paths. A GPL version for anyone willing to share their changes, and a paid commercial license for companies that must keep their code proprietary. MySQL built its business this way, and it is why so many early web companies run MySQL. The catch is that the "free" side competes with the "paid" side, so the company has to be disciplined about which features stay in the GPL version.

## SaaS and hosting

People will pay to not operate software. WordPress.com runs the same GPL WordPress you can download, but Automattic charges for hosting, domains, and support. Canonical does the same with Ubuntu. This is the cleanest model for permissively licensed projects, because there is no license gymnastics, just a better service than doing it yourself.

## Support and consulting

Red Hat's classic model: the software is free, the certified, patched, supported version is the product. Enterprises pay for someone to answer the phone at 2 AM. The same logic powers most consulting firms that build on open source. It scales with people, not code, so margins are thinner, but the floor is reliable.

## Marketplace

When the project is a platform, the ecosystem becomes the product. WordPress plugins, themes, and managed hosting generate a cut for the platform owner. Automattic runs both sides of this: the open core and the marketplace around it.

## Donations and foundations

curl, the tool every developer on earth has used, runs on sponsors and grants, with its lead maintainer effectively funded by the community. Bigger projects shelter under foundations like the Linux Foundation or Apache, which take corporate membership money and pay for infrastructure and legal protection. This works when the software is ubiquitous and nobody has a reason to compete with it.

## The licensing controversies, accurately

Two license wars shaped the current map. MongoDB wrote the Server Side Public License (SSPL) in 2018 and moved from AGPL to it. The SSPL starts from AGPL's copyleft but goes further: if you offer the software as a service, you must release not just your modifications but the entire stack you use to run it, including management, authentication, and UI. The OSI rejected it as not open source, so MongoDB's code is commonly called source-available instead.

Elastic did something similar in 2021, relicensing Elasticsearch and Kibana from Apache 2.0 to a mix of the Elastic License and SSPL, after Amazon started selling a managed Elasticsearch. The licenses were designed to stop clouds from reselling the products. They worked, and they also removed those projects from the strict open source definition.

AGPL itself is different and OSI-approved. It extends GPL copyleft to network use, so running modified AGPL code as a service means sharing your changes, without the SSPL's demand to release the surrounding infrastructure. The practical difference matters if you are choosing a license for a [SaaS business](/how-open-source-licensing-works).

## The pattern underneath

Every model has the same shape: the code is the marketing, and something around it is the product. Sometimes that something is features, sometimes it is a license, sometimes it is operations. None of them work if the software is not genuinely good, because open source companies compete against free, which is a brutal bar.
