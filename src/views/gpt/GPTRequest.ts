import qs from 'qs'
import instance from '@/utils/AxiosInstance'
import { message as Message } from 'ant-design-vue'

type regionProps = Record<'name' | 'value', string | number>
export class GptProcess {
  constructor() {}
  async generateResponse(formFile: FormData, question?: string): Promise<any> {
    const res: any = await instance.request({
      method: 'POST',
      url: '/gptAnalysis',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formFile
    })
    if (!Reflect.has(res.data, 'msg')) {
      Message.error('异常回复信息')
      return Promise.reject('异常回复信息')
    }
    const gptRes: any = res.data.msg.output.choices
    //判断是否为数组
    if (Array.isArray(gptRes)) {
      const codeStr: string = gptRes[0].message.content
      //@ts-ignore
      const regionGDPArray = eval(codeStr.replaceAll('"', "'")) as Array<regionProps>
      regionGDPArray.forEach((item: regionProps) => {
        if (!Number.isNaN(item.value)) item.value = parseFloat(item.value as string)
      })
      return { regionGDPArray, codeStr }
    }
  }
}
