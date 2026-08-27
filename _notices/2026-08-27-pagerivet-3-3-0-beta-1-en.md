---
title: "Avalonia Migration Completed and 3.3.0-beta.1 Announcement"
date: 2026-08-27 20:31:29 +0900
category: Notice
lang: en
notice_id: avalonia-3-3-0-beta-1-2026-08-27
summary: The completed Avalonia migration, PageRivet 3.3.0-beta.1 beta release, and current support scope.
---

The Avalonia migration of PageRivet and the replacement of the previous UI architecture have now been completed.

Starting with version `3.3.0-beta.1`, you can use the new Avalonia-based version of PageRivet.

## Avalonia Migration Completed

The previous Windows-specific UI architecture has been replaced with Avalonia, and the major features have been confirmed to work correctly in the current development environment.

Verification has also been carried out to ensure that the major features of the existing PageRivet continue to work properly under the new architecture, including project editing, preview, MCP integration, and related workflows.

## Why This Release Is Labeled Beta

PageRivet is working normally in the current development environment, but actual user environments may differ depending on factors such as the Windows version, hardware configuration, WebView environment, file permissions, security software, and other system settings.

Because of these differences, unexpected issues—both minor and significant—may still occur during real-world use.

For this reason, the first public release following the Avalonia migration is being distributed with a `beta` tag. Starting with `3.3.0-beta.1`, we will use feedback and issues found in actual user environments to further improve stability.

The `beta` label does not mean that PageRivet is unusable. It means that **the new Avalonia-based architecture still requires additional verification across a wider range of real-world environments**.

## macOS and Linux Support

As mentioned previously, we currently do not have suitable development and testing environments for macOS or Linux.

The Avalonia migration leaves the technical path open for future expansion to both operating systems, but because we cannot currently perform sufficient testing in real environments, we are not able to officially promise macOS or Linux support at this time.

Version `3.3.0-beta.1` is currently developed and verified primarily for Windows.

If suitable macOS or Linux testing environments become available in the future and proper verification becomes possible, we will consider expanding PageRivet support to those operating systems as well.

## Next Steps

For the time being, development will focus on the following areas:

- Real-world user environment testing for `3.3.0-beta.1`
- Identifying regressions introduced during the Avalonia migration
- Improving UI and feature stability
- Revalidating MCP and project workflows
- Fixing issues based on user feedback
- Reviewing the transition from beta to a stable release after sufficient stabilization

If issues are discovered during actual use or if there are important changes, we will continue to share updates through the official PageRivet website and related platforms.

Thank you.
