<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

html {
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
  -webkit-tap-highlight-color: transparent !important;
  height: 100%;
}
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  min-height: 100%;
  height: 100%;
  background-color: var(--background-1);
}

textarea {font-family: 'Montserrat', sans-serif !important;}
button {font-family: 'Montserrat', sans-serif !important;}
button:focus {outline: none;}
input:focus {outline: none;}
.inputStyle {-webkit-appearance: none;}
input {font-family: 'Montserrat', sans-serif !important;} 
textarea:focus {outline: none;}
select:focus {outline: none;}
select {-webkit-appearance: none;}
::selection {background-color: #1CD15C; color: #FFF;}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

/* Variables */
:root {
  --background-1: #0D1117;
  --background-2: #161B22;
  --background-3: #1C222B;
  --border-color: #1C2127;
  --accent-1: #00D855;
  --accent-1-hover: #11A044;
  --title-text: #FFF;
  --body-text: #C9D1D9;
  --not-active-text: #676E79;
  --error-text: #ff2273;
  --error-text-hover: #DA1C61;
}

/* Page */
.pageCon {
  padding-left: 300px;
  width: 100%;
}
.pageWrapper {
  padding: 30px;
}

.inputStyle {
  width: 100%;
  height: 40px;
  background-color: var(--background-3);
  border: none;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 14px;
  color: var(--body-text);
}
.inputStyle::placeholder {
  color: var(--body-text);
}

.errorMsg {
  color: var(--error-text);
  font-size: 14px;
  margin-top: 5px;
}
</style>
