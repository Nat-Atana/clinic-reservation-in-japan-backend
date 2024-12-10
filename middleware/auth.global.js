export default defineNuxtRouteMiddleware((to, from) => {
    const { userToken } = useAuth()

    if (!userToken.value && to.path !== '/auth/login' && to.path !== '/auth/register') {
      return navigateTo('/auth/login')
    }
})