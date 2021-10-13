import * as React from "react"
import { Link, graphql } from "gatsby"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  // const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteTitle = `Stumble Upon Words`;
  // const posts = data.allContentfulPosts.nodes
  const {allContentfulPosts: {nodes: posts}} = data;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.title || post.slug
          const json = JSON.parse(post.blogpost.raw);
          const RICHTEXT_OPTIONS = {
              renderNode: {
                  [BLOCKS.PARAGRAPH]: (node, children) => {
                      //console.log(children);
                      return <p>{children}</p>
                  },
                  [MARKS.BOLD]: (node, children) => {
                      //console.log(children);
                      return <p>{children}</p>
                  }
              }
          }
          return (
            <li key={post.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.createdAt}</small>
                </header>
                <section>
                {documentToReactComponents(json, RICHTEXT_OPTIONS)}
                </section>
                <section>
                <img src={post.blogimage.file.url} alt="hello" width="400" height="250"/>
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulPosts {
      nodes {
        slug
        title
        excerpt
        createdAt(formatString: "yyyy-mm-DD")
        blogpost {
          raw
        }
        blogimage {
          file {
            url
          }
        }
      }
    }
  }
`
