# Shadcn UI Configuration

This document describes the settings in `components.json`, which configures Shadcn UI components and styling preferences.

## Overview

The configuration file defines the project's component library settings, styling options, and import aliases.

## Settings

### Core Settings

- `$schema`: JSON schema for configuration validation
- `style`: Visual style preset ("new-york")
- `rsc`: Enables React Server Components
- `tsx`: Uses TypeScript with JSX

### Tailwind CSS Configuration

- `config`: Path to Tailwind config file
- `css`: Path to global CSS file
- `baseColor`: Base color for the theme ("neutral")
- `cssVariables`: Uses CSS variables for colors
- `prefix`: No prefix for utility classes

### Import Aliases

Defines path aliases for cleaner imports:
- `components`: "@/components"
- `utils`: "@/lib/utils"
- `ui`: "@/components/ui"
- `lib`: "@/lib"
- `hooks`: "@/hooks"

### Icon Library

Uses "lucide" as the icon library for consistent iconography.

## Reference

For more information, see the [Shadcn UI documentation](https://ui.shadcn.com/docs/installation). 