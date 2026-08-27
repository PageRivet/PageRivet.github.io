---
title: "Avalonia Migration Progress Update"
date: 2026-08-27
category: Notice
lang: en
notice_id: avalonia-migration-2026-08-27
summary: An update on the PageRivet Avalonia migration and operating system support plans.
---

The Avalonia migration of PageRivet has now entered its final stages.

Most of the major functionality has been migrated, and the current focus is on reviewing the overall structure, reducing unnecessary coupling and duplication, and making sure the existing features continue to work reliably under the new architecture.

## Windows Support

Development and testing are currently being carried out primarily on Windows.

A significant portion of the major functionality has already been migrated successfully, and based on the current progress, we believe it is reasonable to expect the Avalonia-based Windows version of PageRivet to be completed.

However, final verification and structural cleanup are still in progress. If unexpected issues or additional work are discovered during development, the completion date may be delayed beyond the current expectation.

Rather than setting a fixed release date in advance, we plan to complete the migration only after confirming that the major existing features and overall stability of PageRivet have been sufficiently preserved.

## macOS and Linux Support

Unfortunately, we currently do not have suitable testing environments for macOS or Linux.

One of the reasons for migrating to Avalonia is to move away from a strictly Windows-specific UI architecture and leave a path open for future support of additional operating systems.

This means that macOS and Linux support has not been ruled out.

However, we do not believe it would be appropriate to officially promise support for operating systems that we are currently unable to test properly on real environments.

For the time being, Windows support will remain the primary focus. macOS and Linux compatibility will be considered for future expansion if suitable testing environments become available and proper verification becomes possible.

We cannot guarantee when or whether such testing environments will become available. However, if the necessary conditions are eventually met, we will do our best to expand PageRivet so that it can also be used on macOS and Linux.

## Next Steps

For now, development will focus on the following areas:

- Final cleanup of the Avalonia migration architecture
- Reverification of major existing PageRivet features
- Stability testing on Windows
- Regression testing between the existing functionality and the new architecture
- Final preparation toward a distributable build

If there are any meaningful changes in the migration progress, further updates will be shared through the official PageRivet website and related platforms.

Thank you.
