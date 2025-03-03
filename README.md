# Proyecto-Final

Proyecto de desarrollo de aplicaciones web (PRW) del grupo D de 2ºDAW 2024-2025.

## ToDo and README

> [!IMPORTANT]
> Please, read carefully the READMEs and ToDos in root project, frontend and backend. There can
> be found instructions, troubleshooting steps and overall project features.

## Main branch

Main branch should be a functional version of the project, in terms of basic features and,
more over, project structure. This means that the main branch should always be deployable
and functional, no matter what development stage the project is.

## Installation

### Prerequisites

Ensure you have the following software installed:
#### Global
- [Docker](https://docs.docker.com/get-docker/)
- [VSCode DevContainers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
#### Windows specific
- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)

### Setup Instructions

1. **Clone the Repository**: Start by cloning the project repository.

> [!CAUTION]
> #### Windows
> If you are using Windows, there is a known bug where DevContainers' host-mounted
> volumes won't be able to read Linux's Inotify filesystem events, therefore not updating
> files correctly. It's **highly advisable** to clone the repository directly inside **WSL2**.
>
> To do this, simply follow the instructions but using a WSL shell. To open a WSL shell,
> just execute the following in a CMD:
> ```bash
> wsl
> ```
> We recommend using a WSL distro, such as Ubuntu or Devian, that is ready for developing,
> having tools such as git command. Otherwise, it will be up to your discretion what to do
> in order to follow the remaining steps.

> [!WARNING]
> #### MacOS
> MacOS platform hasn't been tested yet, thus unknown behavier is to be expected.
>
> As because MacOS doesn't have WSL nor use Inotify, but fswatch, a solution for
> possible issues hasn't been proposed yet.

Use this to clone the repo.
   ```bash
   git clone https://github.com/IES-Las-Galletas-DAW-2025-Grupo-D/Proyecto-Final.git
   ```

## Workflow

To develope in this project, we make use of VSCode DevContainers extension.

### Enter a developing environment

Once the cloned project is opened using `code .`, you can access frontend or
backend developing environments by opening the command palette (`CTRL+SHIFT+P`
in windows by default) and running `>Dev Containers: Reopen in Container`.

This will reopen VSCode in the selected DevContainer. Needed extensions and
dependecies will be installed.
> [!NOTE]
> Note that the project containers (services) will be composed.
> You can manage these using Docker Desktop (they should appear there).

> [!NOTE]
> Note that one of these containers (frontend or backend) is also the DevContainer
> you are using. This means we develop in the same evnironment we deploy services.
> And everyone uses the same dependecies and VSCode extensions. Therefore is not
> recommended to install additional extensions, if these require to be installed in
> the DevContainer.

### Switch to a different developing environment

If you want to switch from backend to frontend environment, and vice versa, you can use
the command (command palette) `>Dev Containers. Switch Container`. That easy!

> [!TIP]
> You can have both backend and frontend environments opened at once. To do this,
> simply open a new VSCode (command palette) `>New Window`, and then to the normal
> steps you'd to open the cloned project and a DevContainer.

### Return to the root folder

Even tho each DevContainer contains the entire code base, it's common to want to exit
a DevContainer and have a view of the root project (not in developing environment).

To do this, there are two ways. You could use the command (command palette)
`>Dev Containers: Reopen Folder Locally`. The downside of using this is that is not
fully compatible with WSL environment. This means that, when executed, it'll attepmt
to open the cloned project but in native Windows Filesystemt. So you will have to
manually open it again using WSL. For that reason, we prefere to open it directly
using the command (command palette) `>File: Open Recent...`.

> [!TIP]
> If you feel lost, remember that you can always open again WSL and manually navigate
> to the project folder (where you cloned it) and execute `code .`.
