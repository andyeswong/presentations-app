# EnteracloudPresentations

A modern, feature-rich presentation application that allows users to create, edit, and present beautiful slideshows with various layouts and themes.

![EnteracloudPresentations](https://via.placeholder.com/1200x600?text=EnteracloudPresentations)

## Features

- **User Authentication**: Secure user accounts with authentication
- **Multiple Presentation Themes**: Choose from light, dark, and gradient themes
- **Various Slide Types**:
  - Title slides
  - Content slides
  - Scrollable container slides
  - Comparison tables
  - Diagrams
- **Live Preview**: Preview your slides while editing
- **Presenter Mode**: Present your slides with notes visible only to you
- **Audience Mode**: Clean view for your audience
- **Keyboard Navigation**: Navigate through slides using keyboard shortcuts
- **Fullscreen Mode**: Present in fullscreen with keyboard support
- **Slide Management**: Create, edit, reorder, and delete slides
- **Visual Slide Previews**: See thumbnails of slides in the presentation listing
- **Dark Mode Support**: Full application dark mode compatibility

## Technologies Used

- **Backend**:
  - Laravel 10.x
  - PHP 8.x
  - MySQL/PostgreSQL

- **Frontend**:
  - React
  - TypeScript
  - Inertia.js
  - Tailwind CSS
  - Heroicons

## Requirements

- PHP 8.1 or higher
- Node.js 16.x or higher
- Composer
- npm or yarn
- MySQL/PostgreSQL database

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/enteracloud-presentations.git
   cd enteracloud-presentations
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

4. Copy the example environment file and configure your database:
   ```bash
   cp .env.example .env
   ```

5. Generate an application key:
   ```bash
   php artisan key:generate
   ```

6. Configure your database in the `.env` file

7. Run migrations:
   ```bash
   php artisan migrate
   ```

8. Build assets:
   ```bash
   npm run build
   # or
   yarn build
   ```

9. Start the development server:
   ```bash
   php artisan serve
   ```

## Usage

### Creating a Presentation

1. Log in to your account
2. Click on the "New Presentation" button on the dashboard or presentations page
3. Enter a title, optional description, and select a theme
4. Click "Create" to begin editing your presentation

### Editing Slides

1. From the presentations list, click "Edit" on the presentation you want to modify
2. Add new slides using the "+" button
3. Select different slide types as needed
4. Edit content using the slide editor on the right
5. Preview your slides in real-time in the preview panel

### Presenting

1. From the presentations list, click "Present" to start presentation mode
2. Use the arrow keys to navigate between slides:
   - Left/Right: Previous/Next slide
   - Esc: Exit fullscreen mode
3. For presenter mode, enter the presenter password when prompted

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Developed by [Your Name/Company]
- Icons by [Heroicons](https://heroicons.com/)
- UI Framework by [Tailwind CSS](https://tailwindcss.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
