# Download
App (or installation) can be downloaded on [Github Releases](https://github.com/aqaurius6666/mpboot-gui/releases).

There are three versions available for Ubuntu, MacOS and Windows.
* Ubuntu: `.AppImage` extension.
* MacOS: `.dmg` extension.
* Windows: `.exe` extension.

Please download the version that corresponds to your OS.

# Installation
## Ubuntu
* Download the file with `.AppImage` extension as mentioned in [Download](#download).
* Change the mode of AppImage to executable by running command: ```chmod +x <path-to-file>```.
* You can now double click on AppImage file to open MPBootGUI or open from command-line: ```<path-to-file>```.

## MacOS
* Download the file with `.dmg` extension as mentioned in [Download](#download)
* Install it as you would with any normal installation with a `.dmg` extension by dragging the file to the `Applications` folder.
* You can't open MPBootGUI by double click app icon from Launchpad. You can only open it from command-line: ```/Applications/MpbootGUI/Resources/MacOS/MpbootGUI```.
* A prompt that warns you about security will pop up. Open the Privacy settings and allow MPBootGUI to run.
* You can now open it again from command-line: ```/Applications/MpbootGUI/Resources/MacOS/MpbootGUI```.

## Windows
* Download file with `.exe` extension as mentioned in [Download](#download).
* Double click the installation file to start the installation process.
* Enable Developer mode by searching for “Developer mode” on the Start Menu and toggling it on.
* You can open it by double click on its icon.

# Prerequisite
MPBootGUI need `mpboot` tool to work and require user to manually install `mpboot` and add it to PATH environment variables of OS.

You can install `mpboot` unofficially from [My Github Releases](https://github.com/aqaurius6666/mpboot/releases)

Here are steps to install `mpboot` on 3 mainly OSes.
## Ubuntu and MacOS
* Download the corresponding version of mpboot for your operating system.
* Unzip the file by double clicking it or by running the command ```unzip <path-to-file>```. The mpboot executable file will be in the same directory as the zip file.
* Move the mpboot executable into the `/usr/local/bin` folder by running the command `sudo mv ./mpboot /usr/local/bin/mpboot`.
* You can test the installation by running ```mpboot --help```.

## Windows
* Download the corresponding version of mpboot for your operating system.
* Unzip the file by using 7z
* Copy the absolute path of the extracted output folder.
* Open the environment variables settings and edit the PATH variable by pasting the extracted output folder path and saving the changes.
* Open a new terminal and run ```mpboot --help``` to test the installation.


## Use guide
You can download [example.phy](./example.phy) for testing

1. Start by creating a new workspace. Enter the workspace folder path, workspace name, and add input data for the workspace (`example.phy`)
2. Choose `example.phy` on the left side and click the Run button on the right side
3. The log of the execution will be shown in the middle and the result tree file will be visualized.
4. After running a few executions, you can browse older executions by clicking on the execution folder on the left side. Use the Backward and Forward buttons to browse executions.

# Note
MPBootGUI is currently not be signed by any trusty certificates. OS may report about harmful app or untrusted content. Please check carefully source of report. Don't be panic if it is MPBootGUI's content.

