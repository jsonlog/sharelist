const fs = require('fs')
const os = require('os')
const { createFiledb } = require('./utils/db/filedb');
const configPath = process.cwd() +'/cache/config.json'
const port = process.env.PORT || 33001
const runtime = {}

const db = createFiledb(configPath , {raw:true} , {
  port , 

  proxy_enable : 0 ,

  preview_enable : 1,

  webdav_path : '/webdav/',
  //目录刷新时间 15分钟getDrive
  max_age_dir: 15 * 60 * 1000,
  //外链 10分钟
  max_age_file: 5 * 60 * 1000,

  skin:'default',

  //忽略文件（扩展名）
  ignore_file_extensions:'',

  ignore_files:'.passwd',

  readme_enable:1
});

if(process.env.PORT){
  db.set('port' , port)
}

const save = async (d) => db.set(d)

const installed = () => {
  return db.get('path') && db.get('token')
}

const getConfig = (key) => db.get(key)

const getAllConfig = (key) => db.all

const getPath = () => [].concat( db.get('path') || [] )

const getRuntime = (key) => {
  return runtime[key]
}

const getSkin = (key) => {
  return db.get('skin') || 'default'
}

const setRuntime = (key , value) => {
  runtime[key] = value
}

const saveDrive = (value , name) => {
  if(!name) name = decodeURIComponent(runtime.req.path.replace(/^\//g,''))
  
  const path = getPath()
  let hit = path.find( i => i.name == name)
  if(hit){
    hit.path = value
    db.save(path)
  }
}

//获取当前路径drive
const getDrive = () => {
  const path = getPath()
  const name = decodeURIComponent(runtime.req.path.replace(/^\//g,'').split('/')[0])
  const hit = path.find( i => i.name == name)
  if(hit){
    return hit.path
  }else{
    return false
  }
}

//获取使用特定协议的drive
const getDrives = (protocols) => {
  const path = getPath()
  let ret = path.filter(i => protocols.includes(i.path.split(':')[0]))
  // issue:68
  // 如果只有一个目录则直接列出，导致挂载路径不一致 更新失败。
  if(path.length == 1){
    if(ret.length){
      ret[0] = {...ret[0] , root:true}
    } 
  }
  return ret
}

module.exports = { getConfig , getAllConfig, save , installed , getPath , setRuntime , getRuntime , saveDrive , getDrive , getSkin , getDrives }