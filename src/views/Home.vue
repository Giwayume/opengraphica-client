<template>
    <section
        aria-label="Home"
        class="d-flex flex-row align-items-center justify-content-center text-white bg-dark"
        style="">
        <div class="text-center p-4" style="max-width: 100%">
            <h1 class="text-nowrap">
                <span ref="logoIcon" class="fas fa-draw-polygon mr-3"></span>
                <span ref="logoLetter" v-for="(letter, i) in 'OpenGraphica'" :key="i">{{ letter }}</span>
            </h1>
            <p class="my-4">
                OpenGraphica is a free open source graphic design tool that works inside your web browser!
                <span class="d-block text-muted my-2">(Currently in alpha testing)</span>
            </p>
            <div class="pt-2">
                <router-link ref="useOnlineLink" to="edit" class="btn btn-lg btn-outline-light mx-2 my-2" v-touch:start="onUseOnline">Use Online</router-link>
                <a class="btn btn-lg btn-outline-light mx-2 my-2" target="_blank" href="https://github.com/opengraphica/opengraphica-app/releases">Download</a>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    mounted() {
        this.$refs.logoIcon.classList.add('opengraphica-logo-glow');
        setTimeout(() => {
            if (this.$refs.useOnlineLink) {
                this.$refs.useOnlineLink.$el.classList.add('opengraphica-home-button-glow');
            }
        }, 400);
        for (let i = 0; i < this.$refs.logoLetter.length; i++) {
            setTimeout(() => {
                if (this.$refs.logoLetter[i]) {
                    this.$refs.logoLetter[i].classList.add('opengraphica-logo-glow');
                }
            }, i * 100);
        }
    },
    methods: {
        onUseOnline() {
            this.$store.dispatch('setSkipHomePage', true);
        }
    }
};
</script>

<style scoped>
    @keyframes opengraphica-logo-glow {
        0% {
            color: #74bee6;
            transform: scale(1);
        }
        25% {
            color: white;
            transform: scale(1.1);
        }
        50% {
            color: #9ef5b7;
            transform: scale(1);
        }
        75% {
            color: #ec807c;
        }
        100% {
            color: #74bee6;
        }
    }
    @keyframes opengraphica-home-button-glow {
        0% {
            color: #74bee6;
            border-color: #74bee6;
        }
        25% {
            color: white;
            border-color: white;
        }
        50% {
            color: #9ef5b7;
            border-color: #9ef5b7;
        }
        75% {
            color: #ec807c;
            border-color: #ec807c;
        }
        100% {
            color: #74bee6;
            border-color: #74bee6;
        }
    }
    .opengraphica-logo-glow {
        display: inline-block;
        animation: opengraphica-logo-glow 6.5s infinite;
    }
    .opengraphica-home-button-glow {
        display: inline-block;
        animation: opengraphica-home-button-glow 6.5s infinite;
    }
    .opengraphica-home-button-glow:hover {
        color: black !important;
    }
    section {
        box-shadow: inset 0px 0px 180px 22px rgba(0,0,0,0.4);
        overflow-x: hidden;
        overflow-y: auto;
        width: 100vw;
        height: 100vh;
        font-family: 'Montserrat', sans-serif;
        position: absolute;
    }
    h1 {
        font-size: 5em;
    }
    p {
        color: #ddd;
        font-size: 1.4em;
        line-height: 1.4;
        margin: 0 auto;
        max-width: 40rem;
    }
    a.btn-lg {
        font-size: 1.5rem;
    }
    @media screen and (max-width: 700px) {
        h1 {
            font-size: 3rem;
        }
        p {
            font-size: 1.2rem;
            line-height: 1.2;
            max-width: 30rem;
        }
        a.btn-lg {
            font-size: 1.3rem;
        }
    }
    @media screen and (max-width: 400px) {
        h1 {
            font-size: 2rem;
        }
    }
</style>