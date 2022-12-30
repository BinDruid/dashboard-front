<template>
  <v-locale-provider rtl>
    <v-app>
      <v-app-bar density="compact" title="نمودارهای تفکیکی" color="info">
      </v-app-bar>
      <v-navigation-drawer permanent :rail="rail" @click="rail = false" location="right" color="info">
        <v-list-item class="my-2" prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="کارشناس" nav>
          <template v-slot:append>
            <v-btn variant="text" icon="mdi-chevron-right" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <router-link to="/"> <v-list-item prepend-icon="mdi-home-city" title="نمودار تفکیکی" value="home">
            </v-list-item>
          </router-link>
          <router-link to="/timeline"> <v-list-item prepend-icon="mdi-account" title="نمودار زمانی"
              value="profile"></v-list-item>
          </router-link>
          <v-list-item prepend-icon="mdi-account-group-outline" title="کاربران" value="users"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref(null)
const rail = ref(true)

</script>
