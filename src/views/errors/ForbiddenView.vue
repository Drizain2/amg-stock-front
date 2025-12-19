<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const router = useRouter()
const route = useRoute()

const message = computed(()=>{
    
})
const goHome = () => {
    router.push({ name: 'Dashboard' })
}
const goBack = () => {
    router.back()
}
</script>