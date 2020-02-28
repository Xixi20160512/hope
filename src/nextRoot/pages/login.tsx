import React from 'react'
import Header from '../components/Header'
import UserForm, { useUserForm } from '../components/UserForm'
import { Grid, Button, Typography, Link } from '@material-ui/core'
import useAuth, { LOCALSTATE } from '../js/hooks/useAuth'
import { post } from '../js/request'

const Login: React.FC = () => {
  const { setLocal } = useAuth()

  const [allFields, { checkForm, form }] = useUserForm()

  const doLogin = async () => {
    if (checkForm()) {
      const res = await post<string | undefined>('/open/login', form)
      if (res) {
        setLocal(LOCALSTATE.logged)
        location.href = '/'
      }
    }
  }
  return (
    <div>
      <Header />
      <UserForm allFields={allFields}>
        <Grid item>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Button onClick={doLogin} variant="outlined">
                登录
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="caption">
                还没有账号？立即<Link href="/registry">注册</Link>！
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </UserForm>
    </div>
  )
}
export default Login
