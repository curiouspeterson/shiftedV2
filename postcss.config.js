/**
 * PostCSS Configuration
 * 
 * Configuration file for PostCSS, defining the CSS processing pipeline.
 * This setup integrates Tailwind CSS and adds vendor prefixes automatically.
 * 
 * Plugins:
 * - tailwindcss: Processes Tailwind CSS directives and utilities
 * - autoprefixer: Adds vendor prefixes for broader browser compatibility
 */

module.exports = {
  plugins: {
    // Process Tailwind CSS classes and directives
    tailwindcss: {},
    // Add vendor prefixes to CSS rules
    autoprefixer: {},
  },
} 