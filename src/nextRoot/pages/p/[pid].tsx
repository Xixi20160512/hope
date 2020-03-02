import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { get } from '../../js/request'
import showdown from 'showdown'
import { Box, makeStyles, Grid, Typography, Container } from '@material-ui/core'
import { Edit as EditIcon, Loyalty as TagIcon } from '@material-ui/icons'
import Header from '../../components/Header'
import Head from 'next/head'
import clsx from 'clsx'
import useAuth from '../../js/hooks/useAuth'
import time from 'dayjs'
import { post as postMethod } from '../../js/request'
interface Post {
  title: string
  content: string
  uid: {
    username: string
  }
}

const useStyles = makeStyles(theme => ({
  markdownBody: {
    // padding: theme.spacing(2),
  },
  titleBlock: {
    margin: theme.spacing(2, 0),
    '& .title': {
      fontWeight: 500,
      fontSize: 16,
    },
    '& .author': {
      fontStyle: 'italic',
    },
    '& .tag': {
      padding: '2px',
      borderRadius: '2px',
      backgroundColor: 'lightblue',
      fontSize: '12px',
    },
  },
}))

const converter = new showdown.Converter()
converter.setFlavor('github')

const PostView = ({ post }) => {
  useEffect(() => {}, [])
  const classes = useStyles()
  const router = useRouter()
  const { isMe } = useAuth()

  useEffect(() => {
    postMethod('open/userAction', {
      type: 'click',
      payload: {
        pid: post.id,
      },
    })
  }, [])
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"
        ></link>
      </Head>
      <Header />

      <Container maxWidth="md">
        <Grid
          className={classes.titleBlock}
          container
          direction="column"
          alignItems="flex-start"
        >
          <Grid className="title" container xs={12}>
            <div>{post.title}</div>
            {isMe(post.uid.id) && (
              <EditIcon
                onClick={() => router.push(`/write?pid=${post.id}`)}
                fontSize="small"
              />
            )}
          </Grid>
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item>
              <div className="author">{post.uid.username}</div>
            </Grid>
            <Grid item>
              <Typography color="textSecondary" variant="caption">
                {time(post.createTime || post.updateTime).format(
                  'YYYY/MM/DD HH时'
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item>
              <TagIcon fontSize="small" />
            </Grid>
            {post.tags.split(' ').map(t => (
              <Grid item>
                <span className="tag">{t}</span>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Box
          className={clsx('markdown-body', classes.markdownBody)}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></Box>
      </Container>
    </div>
  )
}

PostView.getInitialProps = async ctx => {
  const { pid } = ctx.query
  const post = await get<Post>(`$/open/post/${pid}`)
  post.content = converter.makeHtml(post.content)
  return { post }
}

export default PostView
