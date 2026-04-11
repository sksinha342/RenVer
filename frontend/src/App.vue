<template>
  <div class="container">
    <h2>Create Account</h2>
    
    <!-- फॉर्म सबमिट होने पर handleSignup फंक्शन चलेगा -->
    <form @submit.prevent="handleSignup">
      <input v-model="formData.username" type="text" placeholder="Enter Username" required />
      <input v-model="formData.email" type="email" placeholder="Enter Email" required />
      <button type="submit">Sign Up</button>
    </form>

    <!-- Flask से आया रिस्पॉन्स यहाँ दिखेगा -->
    <p v-if="responseMessage" class="success-msg">{{ responseMessage }}</p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 1. 'State' मैनेजमेंट: इनपुट डेटा को ट्रैक करना
const formData = reactive({
  username: '',
  email: ''
});

const responseMessage = ref('');

// 2. Flask API को डेटा भेजने का फंक्शन
const handleSignup = async () => {
  try {
    const response = await fetch('http://127.0.0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // JSON में बदलना
    });

    const result = await response.json();
    responseMessage.value = result.message; // UI को तुरंत अपडेट करना
    
    // फॉर्म खाली करना
    formData.username = '';
    formData.email = '';
  } catch (error) {
    responseMessage.value = "Backend is not running!";
  }
};
</script>

<style>
.container { font-family: sans-serif; max-width: 300px; margin: 50px auto; text-align: center; }
input { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
button { width: 100%; padding: 10px; background: #42b983; color: white; border: none; cursor: pointer; }
.success-msg { color: green; margin-top: 20px; font-weight: bold; }
</style>
