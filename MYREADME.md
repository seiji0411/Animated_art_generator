# Generate NFT assets

## Configuration
- Install python and node, gitski
    - Install Nodejs
    - Install python3
    - Install [gifski](https://gif.ski/). I recommend using brew `brew install gifski` if you're on Mac OSX. If you don't have brew you can install it using [brew](https://brew.sh/) on Mac OSX. Or if you're on Windows
  you can install it using [Chocolatey](https://community.chocolatey.org/): `choco install gifski`.  
    If you're on Linux, some people were having issues with `gifski` so you can skip installing it. You will have to set
    the `gifTool` config to `imageio` instead (see later instructions). 
    If none of those methods work, follow instructions on gifski [gifski Github](https://github.com/ImageOptim/gifski). Gifski is crucial for this tool because it provides the best gif generation
    out of all the tools I checked out (PIL, imageio, ImageMagic, js libraries).



- Set config in `global_config.json`
```
...
  "totalSupply": 100,
  "height": 625,
  "width": 500,
  "framesPerSecond": 30,
  "numberOfFrames": 30,
...
```

## Generate

### Step 1.
Copy layers in `step1_layers_to_spritesheet/output`

### Step 2.
- Set the order of layers

```
    ...
    layersOrder: [
      { name: "Background" },
      { name: "Mouth"},
      { name: "Face" },
      { name: "Gear" },
      { name: "Marbles"},
      { name: "Headwear"},
    ],
    ...
```

- Run command
```
$ cd step2_spritesheet_to_generative_sheet
$ yarn generate
$ cd..
```

### Step3

- Run command
```
$ python step3_generative_sheet_to_output/build.py
```

- Result
`build/gifs` , `buld/json`

### Update JSON

- Run command
```
$ cd step2_spritesheet_to_generative_sheet
$ node utils/updateInfo.js
$ cd..
```