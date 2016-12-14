# config-upload [![npm](https://img.shields.io/npm/v/config-upload.svg)](https://www.npmjs.com/package/config-upload)
> 📦 Upload files to storage with only one command.

## Install

```sh
$ yarn add dev config-upload
```

or install globally

```sh
$ yarn global add config-upload
```

If you prefer using npm:

```sh
$ npm install --dev config-upload
```

## Usage

1. Run `config-update --init` to create a config file with prompt. Or simply putting config in `.config-upload.json`.

  ```json
  {
    "dists": {
      "s3": {
        "bucket": "my-vault",
        "folder": "path/to/images"
      }
    },
    "sources": [
      {
        "dist": "s3",
        "include": "images/*",
      }
    ]
  }
  ```

2. Upload files to storage with the following command

  ```sh
  $ config-upload
  ```

## CLI

```
$ config-upload --help

  Usage
    $ config-upload [options]

  Options
    --init           Initialize a configuration file.
    --no-fail-fast   Upload all files no matter what. Default will exiting on first failure.
    --config         Config file path. Default is ".config-upload.json".
    --context        Additional context provided to config.

  Examples
    $ config-upload --init
    $ config-upload
    $ config-upload --config path/to/config.json
    $ config-upload --context '{"revision": "v1.2.3"}'
```

## Config

Need to configure some options by putting it in `.config-upload.json`

```json
{
  "dists": {
    "dist name": {
      "type": "s3",
      "bucket": "bucket-name",
      "folder": "path/to/folder",
      "filename": "[name].[other-context].[ext]",
      "uploader info": "...",
      "another uploader info": "..."
    }
  },
  "sources": [
    {
      "dist": "dist name",
      "include": "my-files-folder/*",
      "exclude": "**/file_not_include",
      "folder": "override/folder/of/dist",
      "filename": "override_the_filename_from_dist"
    }
  ]
}
```
### dists

#### dist name
Type: `String`

Name the distination

#### type
Type: `String`

The way to upload. If not specify, it will use `dist name` as default.

Currently support types:
- `s3`
- `qiniu`

#### bucket
Type: `String`

Storage's bucket name.

#### folder
Type: `String`

Default: `''`

Folder's path.

#### filename
Type: `String`

Default: `[name].[ext]`

File name in storage. Default is original file name.

`folder` and `filename` enable you to replace value with [name] [ext] or other injected context. For example, if uploaded file is `image1.jpg`, `folder/to/[ext]/` will replaced to `folder/to/jpg`.

Provide context example:
```
command:            $ config-upload --context '{"revision": "v4", "prefix": "a"}'
source:             "bird.png"
folder:             "/folder/[revision]"
filename:           "[prefix]_[name].[ext]"
```
file path in storage: `/folder/v4/a_bird.png`

### sources
Type: `Array<Object>`

Files prepared to upload by the defined array of object.

#### dist
Type: `String`

An upload destination defined in the `dists` section. Specify `dist name` as it's value.

#### include
Type: `String`

Includes files that matching pattern. Using [glob].

#### exclude
Type: `String`

Excludes files that matching pattern. It takes priority over `include`. Using [glob].

#### folder
Override folder settings.

#### filename
Override filename settings.

## Config Example

### Basic example - Upload to S3

```json
{
  "dists": {
    "s3": {
      "bucket": "BUCKET_NAME",
      "folder": "path/to/folder",
      "accessKey": "XXXXXXXXXXXXXXX",
      "secretKey": "XXXXXXXXXXXXXXX"
    },
  },
  "sources": [
    {
      "dist": "s3",
      "include": "upload_files/*"
    },
  ]
}
```

### Custom Distination Name - Use s3 uploader
```json
{
  "dists": {
    "my_vault": {
      "type": "s3",
      "bucket": "BUCKET_NAME",
    },
  },
  "sources": [
    {
      "dist": "my_vault",
      "include": "upload_files/*"
    }
  ]
}
```

### Exclude file - Without .txt file

```json
{
  "dists": {
    "s3": {
      "bucket": "BUCKET_NAME",
    },
  },
  "sources": [
    {
      "dist": "s3",
      "include": "upload_files/*",
      "exclude": "**/*.txt"
    }
  ]
}
```

### Provide context - Git revision in folder path

**command:**
```sh
$ config-upload --context "{\"revision\": \"`git rev-parse HEAD`\"}"
```

**config:**
```json
{
  "dists": {
    "s3": {
      "bucket": "BUCKET_NAME",
      "folder": "folder/[revision]"
    },
  },
  "sources": [
    {
      "dist": "s3",
      "include": "upload_files/*"
    }
  ]
}
```

## TODO
- [ ] Support YAML format
- [ ] AWS S3 permission group
- [ ] More uploaders

## LICENSE
MIT

[glob]: https://en.wikipedia.org/wiki/Glob_(programming)
