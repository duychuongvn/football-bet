<template src="./flip-countdown.component.html"></template>
<style lang="scss" scoped src="./flip-countdown.component.scss"></style>

<script>
  let interval = null

export default {
  name: 'flipCountdown',
  props: {
    deadline: {
      type: String
    },
    stop: {
      type: Boolean
    },
    islabel: {
      type: Boolean
    }
  },
  data () {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
      date: null,
      diff: 0,
      show: false,
      timeData: [
        {
          current: 0,
          previous: 0,
          label: 'Days',
          elementId: 'flip-card-days'
        },
        {
          current: 0,
          previous: 0,
          label: 'Hours',
          elementId: 'flip-card-hours'
        },
        {
          current: 0,
          previous: 0,
          label: 'Minutes',
          elementId: 'flip-card-minutes'
        },
        {
          current: 0,
          previous: 0,
          label: 'Seconds',
          elementId: 'flip-card-seconds'
        }
      ]
    }
  },
  created () {
    if (!this.deadline) {
      throw new Error("Missing props 'deadline'")
    }
    const endTime = this.deadline
    this.date = Math.trunc(Date.parse(endTime.replace(/-/g, '/')) / 1000)
    if (!this.date) {
      throw new Error("Invalid props value, correct the 'deadline'")
    }
    interval = setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  },
  mounted () {
    if (this.diff !== 0) {
      this.show = true
    }
  },
  computed: {
    seconds () {
      return Math.trunc(this.diff) % 60
    },
    minutes () {
      return Math.trunc(this.diff / 60) % 60
    },
    hours () {
      return Math.trunc(this.diff / 60 / 60) % 24
    },
    days () {
      return Math.trunc(this.diff / 60 / 60 / 24)
    }
  },
  watch: {
    now (value) {
      this.diff = this.date - this.now
      if (this.diff <= 0 || this.stop) {
        this.diff = 0
        clearInterval(interval)
      } else {
        this.updateTime(0, this.days)
        this.updateTime(1, this.hours)
        this.updateTime(2, this.minutes)
        this.updateTime(3, this.seconds)
      }
    }
  },
  filters: {
    twoDigits (value) {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
  },
  methods: {
    updateTime (idx, newValue) {
      if (idx >= this.timeData.length || newValue === undefined) {
        return
      }

      if (window['requestAnimationFrame']) {
        this.frame = requestAnimationFrame(this.updateTime.bind(this))
      }

      const d = this.timeData[idx]
      const val = (newValue < 0 ? 0 : newValue)

      if (val !== d.current) {
        d.previous = d.current
        d.current = val

        const el = document.querySelector(`#${d.elementId}`)
        if (el) {
          el.classList.remove('flip')
          void el.offsetWidth
          el.classList.add('flip')
        }
      }
    }
  },
  beforeDestroy () {
    if (window['cancelAnimationFrame']) {
      cancelAnimationFrame(this.frame)
    }
  },
  destroyed () {
    clearInterval(interval)
  }
}
</script>
