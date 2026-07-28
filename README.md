# Handwriting AI Teacher Dashboard

A polished front-end prototype for a teacher-facing handwriting screening dashboard. The project demonstrates an interactive page for student risk screening, handwriting sample upload, AI-style analytics, and a teacher portal experience.

## Project Structure

- `index.html` - Main application layout and UI structure.
- `style.css` - Custom styling, responsive layout, theme support, and interactive UI states.
- `script.js` - Client-side logic for routing, table filtering/sorting, upload preview, handwriting canvas, charts, theme toggle, and modal interactions.

## Features

- Responsive sidebar navigation with sidebar collapse and mobile toggle.
- Teacher dashboard overview with summary cards, activity feed, calendar, risk heatmap, and analytics charts.
- Student screening table with:
  - live search
  - filters for class, risk level, date, teacher, age, and gender
  - sorting by student ID and name
  - action buttons and modal details for each student
- Upload area for handwriting samples with drag-and-drop plus file picker support.
- Handwriting preview canvas with interactive drawing, sample load, and handwriting metrics.
- Simulated upload progress, processing steps, and success status.
- Theme toggle with persisted light/dark mode using `localStorage`.
- Charts rendered using Chart.js for class screening counts, risk distribution, monthly trend, radar risk pattern, and scatter progress.
- Accessibility controls for high contrast mode and larger font sizes.

## How to Run

1. Open the project folder in a browser or editor.
2. Open `index.html` directly in a web browser.

> No build tools or package manager are required. This project is static HTML/CSS/JS.

## Dependencies

This project loads the following external libraries via CDN:

- Bootstrap 5.3
- Bootstrap Icons
- Chart.js

## Notes

- The page is a front-end prototype and does not connect to a backend API.
- Student data and screening metrics are hard-coded in `script.js`.
- Upload handling and risk analysis are simulated for demonstration purposes.

## Customization

To customize the dashboard:

- Update student records in `script.js` under the `students` array.
- Modify cards, charts, and analytics content directly in `index.html`.
- Adjust styling in `style.css` for colors, spacing, and theme variants.

## File Summary

### `index.html`

- Contains navigation, header, dashboard sections, upload UI, results sections, and modal markup.
- Includes components for upload preview, canvas drawing, filters, student table, and chart canvases.

### `style.css`

- Defines theme variables for light and dark mode.
- Styles the sidebar, topbar, panels, cards, tables, upload area, canvas, and responsive layout.
- Implements animation effects for loading spinner and interactive elements.

### `script.js`

- Initializes UI behavior on `window.load`.
- Manages chart rendering with Chart.js.
- Handles student table filtering, sorting, and modal display.
- Implements the upload experience and file preview drawing.
- Contains handwriting canvas drawing and metric simulation logic.

## License

This repository is provided as a demo project and can be used freely for learning and prototyping.
