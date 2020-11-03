## Windows

### Prerequisites
- A PC with Windows 7 or newer version.
- Full administrator rights.

### Steps

- **Windows installer:** Get the latest installation file called `powercomp-setup.exe` at https://github.com/J-Dahlgren/Power-Comp/releases/latest in the assets section.
    - The browser may warn against downloading the file, download anyway.

- Run the installer by double-clicking it.
    - You may get a warning about the software because it isn't signed with a certificate, run anyway.

- The installer will prompt you for an install location. The default is usually correct.

- If selected, a shortcut is created on your desktop. Double click it to start the server.
    - A console window should open up, this means everything is up and running.

## Configuration

To configure the application, go to the install location. 
There will be a file that is called "power-comp.env", you can modify the following environment variables in it:
- Application port
    - All clients need to "refresh" with the new port number if changed
- Database filename
- Log level

If you want to have a playground with a prepopulated temporary database, set the variable `DATABASE_NAME = ":memory:"`. This will give you an environment similar to the demo site.

The application need to be restarted for any changes to take effect.