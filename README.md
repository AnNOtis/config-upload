# config-upload
upload file to s3 by configuration file

## Install

```sh
yarn global add config-upload
```

## Usage

## CLI
```sh
$ config-upload [options]
```

### options

#### -n, --no-fail-fast
if specific, the process will not exit with failure until finish all tasks

#### -c, --configs [path]
specify configuration file path. default is `.uploadrc`

### --variables
example:
```sh
config-upload --variables '{"revision": "1.2.3"}'
```

## Configurations

```json
{
  "dists": {
    "s3": {
      "bucket": "SOME_BUCKET",
      "folder": "path/to/folder"
    },
    "custom dist": {
      "uploader": "s3",
      "path": "path/to/[custom_variable]/[name].[ext]"
    }
  },
  "sources": [
    {
      "dist": "s3",
      "include": "dist/*.js",
      "exclude": "*.test.js"
    },
    {
      "dist": "custom dist",
      "include": "dist/"
    }
  ]
}
```
