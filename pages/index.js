import path from 'path'
import fs from 'fs/promises'
import Link from 'next/link'
function HomePage(props) {
  const { products } = props

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {/* 动态路由参数 */}
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export async function getStaticProps() {
  console.log('再次生成页面...')

  //getStaticProps在服务器端执行，可以使用nodejs的fs功能，这些代码对客户端安全
  const filePath = path.join(process.cwd(), 'data', 'dummy-data.json')
  const jsonData = await fs.readFile(filePath)
  const data = JSON.parse(jsonData)

  //如果data不存在，页面转向/no-data
  if (!data) {
    return {
      redirect: {
        destination: '/no-data',
      },
    }
  }
  //如果data为空,返回notFound 404页面
  if (data.products.length === 0) {
    return { notFound: true }
  }

  return {
    props: {
      products: data.products,
    },
    //每隔10秒重新静态生成一次这个页面
    revalidate: 10,
  }
}

export default HomePage
