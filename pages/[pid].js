import { Fragment } from 'react'
import path from 'path'
import fs from 'fs/promises'

function ProductDetailPage(props) {
  const { loadedProduct } = props
  //下面的代码和fallback:true配合使用
  //找不到的pid页面会出错提示：Failed to load static props
  // if (!loadedProduct) {
  //   return <p>加载中。。。</p>
  // }
  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  )
}

//读取虚拟数据的异步函数
async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-data.json')
  const jsonData = await fs.readFile(filePath)
  const data = JSON.parse(jsonData)

  return data
}

export async function getStaticProps(context) {
  const { params } = context
  //获取动态路由参数pid
  const productId = params.pid

  const data = await getData()
  //根据productId pid查找产品
  const product = data.products.find((product) => product.id === productId)

  //如果产品不存在，返回404页面
  if (!product) {
    return { notFound: true }
  }
  return {
    props: {
      loadedProduct: product,
    },
  }
}

// 因为[pid].js是一个动态页面，默认不仅行静态渲染，
// 所以进行getStaticProps静态渲染后，要getStaticPaths,告诉nextjs要预先生成的路由路径
export async function getStaticPaths() {
  const data = await getData()
  const ids = data.products.map((product) => product.id)
  //所有pid集合
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }))

  return {
    paths: pathsWithParams,
    //fallback的三种值
    //false: 页面少，生成所有页面路径情况下用
    //true: 页面多，生成部分页面路径的情况下
    //'blocking' : 推荐，和fallback:true差不多，不需要手动设置加载中...的部分
    fallback: 'blocking',
  }
}
export default ProductDetailPage
