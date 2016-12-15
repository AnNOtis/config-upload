const fs = require('fs')
const inquirer = require('inquirer')

console.log('Answer questions below will help you building a configuration file.')

const questions = [
  {
    type: 'input',
    name: 'include',
    message: 'What files do you want to upload? (Using glob pattern like "imgs/*.png".)',
    validate: function (input) {
      if (!input) {
        return 'Can\'t be Empty'
      }
      return true
    }
  },
  {
    type: 'list',
    name: 'storage',
    message: 'Which storage do you use?',
    choices: ['AWS S3', 'Qiniu'],
    default: 'AWS S3',
    filter: function (val) {
      return {'AWS S3': 's3', Qiniu: 'qiniu'}[val]
    }
  },
  {
    type: 'list',
    name: 'authWay',
    message: 'Choose the way to provide credentials',
    choices: [
      'Credentials File',
      'Access Key & Secret Key',
      'AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY from env'
    ],
    default: 'Credentials File',
    when: function (answers) {
      return answers.storage === 's3'
    },
    filter: function (val) {
      return {
        'Credentials File': 'file',
        'Access Key & Secret Key': 'key',
        'AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY from env': 'env'
      }[val]
    }
  },
  {
    type: 'input',
    name: 'credentials',
    message: 'Enter credentials file path:',
    when: function (answers) {
      return answers.authWay === 'file'
    },
    validate: function (input) {
      if (!input) {
        return 'Need to set a file path.'
      }

      if (!fs.existsSync(input)) {
        return 'The file "' + input + '" not exist.'
      }

      return true
    }
  },
  {
    type: 'input',
    name: 'accessKey',
    message: 'Enter Access Key:',
    when: function (answers) {
      return answers.storage === 'qiniu' || answers.authWay === 'key'
    }
  },
  {
    type: 'input',
    name: 'secretKey',
    message: 'Enter Secret Key:',
    when: function (answers) {
      return answers.storage === 'qiniu' || answers.authWay === 'key'
    }
  },
  {
    type: 'input',
    name: 'bucket',
    message: 'Enter the bucket name of storage:',
    validate: function (input) {
      if (!input) {
        return 'Can\'t be Empty'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'folder',
    message: 'Enter the folder path of storage:'
  }
]

inquirer.prompt(questions).then(function (answers) {
  const dists = {}
  const type = answers.storage
  dists[type] = {
    type: type,
    bucket: answers.bucket,
    folder: answers.folder
  }
  if (answers.folder) {
    dists[type].folder = answers.folder
  }
  if (answers.credentials) {
    dists[type].credentials = answers.credentials
  }
  if (answers.authWay === 'file') {
    dists[type].credentials = answers.credentials
  }
  if (answers.authWay === 'key') {
    dists[type].accessKey = answers.accessKey
    dists[type].secretKey = answers.secretKey
  }

  const sources = [
    {
      dist: answers.storage,
      include: answers.include
    }
  ]

  const config = {
    dists: dists,
    sources: sources
  }
  const strigifyConfig = JSON.stringify(config, null, '  ')
  fs.writeFileSync(process.cwd() + '/.config-upload.json', strigifyConfig)
  console.log('Following configs is being writen to ".config-upload.json":')
  console.log(strigifyConfig)
})
