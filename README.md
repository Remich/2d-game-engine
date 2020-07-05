# 2D Game Engine

This is a 2D Game Engine written in Javascript.
It was written for educational purposes only.

It is not intended for serious projects as there are still a lot of features missing.

[![](https://raw.githubusercontent.com/Remich/2d-game-engine/master/screenshot-thumbnail.png)](https://raw.githubusercontent.com/Remich/2d-game-engine/master/screenshot.png)

## Features

- Animations with Spritesheets
- Sprite Rotation & Flipping
- Parallax Scrolling of Backgrounds
- Camera Interpolation
- Double Buffering
- Simple Collision Detection via Rectangular Hitboxes
- Input Handling (supports Key-Combinations)
- Maps encoded as JSON-Files
- Zoom

## Demo

You can view a [Demo](http://renemichalke.de/work/2d-game-engine/) here.  
Best performance with Chromium / Chrome.  

### Controls

- **&larr;,&rarr;**: Walk, Run, Brake  
- **&uarr;**: Look Up  
- **&darr;**: Roll, Crouch  
- **SPACE**: Jump  
- **SPACE + &uarr;**: Peel Out (when Standing)  

## Missing Features

- [ ] Sound
- [ ] State Machine for different Scenes
- [ ] Loading Screen with Progress
- [ ] Reloading of Local Cache
- [ ] z-index of Objects (Currently the order in which the objects are created determines their z-index.)	
