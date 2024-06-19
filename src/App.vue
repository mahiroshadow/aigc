<template>
  <div class="img-upload">
    <InputGroup compact>
      <Input v-model:value="fileName" style="width: calc(100% - 6rem)"> </Input>
      <Button @click="chooseFile" style="width: 6rem">选择文件</Button>
    </InputGroup>
  </div>
  <div class="img-parser">
    <Image width="50rem" v-if="imgShow" :src="imgUrl"></Image>
    <Codemirror v-model:value="code" width="800" height="400" v-if="imgShow"></Codemirror>
  </div>
  <div class="map-container" ref="map"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import ChangAn from '../geoJson/100000/130000/130100.geoJson?url'
import NanJing from '../geoJson/100000/320000.geoJson?url'
import { ref, onMounted, nextTick } from 'vue'
import { GptProcess } from '@/views/gpt/GPTRequest'
import { Input, InputGroup, Button, message as Message, Image } from 'ant-design-vue'
import { option } from '@/hooks/echarts/ChartsOptionTemplate'
import 'codemirror/mode/javascript/javascript.js'
import Codemirror from 'codemirror-editor-vue3'
let fileInputer: any | null = null
const gpt = new GptProcess()
const fileName = ref<string>()
const imgUrl = ref<string>('')
const imgShow = ref<boolean>(false)
const code = ref<string>()
let charts: any
/**
 * 选择文件
 * @param
 **/
const chooseFile = async () => {
  if (!fileInputer) {
    fileInputer = document.createElement('input')
    fileInputer.type = 'file'
    fileInputer.id = 'inputer'
    fileInputer.addEventListener('change', fileHanlder, false)
  }
  fileInputer.click()
}
/**
 * 文件处理
 * @param
 **/
async function fileHanlder(this: any): Promise<any> {
  if (this.files.length) {
    const file: File = this.files[this.files.length - 1]
    if (!file.type.startsWith('image')) {
      Message.error('错误上传，请上传图片')
      return Promise.reject('错误的上传类型')
    }
    imgShow.value = true
    imgUrl.value = URL.createObjectURL(file)
    const base64: string = `data:${file.type};base64,${btoa(
      Array.from(new Uint8Array(await file.arrayBuffer()), (byte) =>
        String.fromCodePoint(byte)
      ).join('')
    )}`
    const fd = new FormData()
    fd.append('imgFile', file)
    fd.append('saveName', file.name)
    //让gpt进行回复
    const { regionGDPArray, codeStr } = await gpt.generateResponse(fd)
    code.value = codeStr
    console.log(regionGDPArray)
    charts.setOption({
      series: [
        {
          name: '人均GDP',
          type: 'map',
          mapType: 'map',
          aspectScale: 0.85,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#000'
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                color: '#333'
              }
            }
          },
          data: regionGDPArray
        }
      ]
    })
  }
}

const map = ref<HTMLDivElement | null>()

onMounted(async () => {
  await nextTick()
  const res = await (await fetch(NanJing)).json()
  echarts.registerMap('map', res)
  charts = echarts.init(map.value!)
  charts.setOption(option)
})
</script>

<style lang="scss">
.map-container {
  margin: 0 auto;
  width: 50rem;
  height: 35rem;
}
.img-upload {
  width: 50rem;
  margin: 0 auto;
}
.img-parser {
  margin: 3rem auto;
  width: 103rem;
  display: flex;
  justify-content: space-around;
}
</style>
