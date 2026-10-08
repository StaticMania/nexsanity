import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, CustomEase, ScrollTrigger, SplitText)

if (!CustomEase.get('accordion-ease')) {
  CustomEase.create('accordion-ease', '0.625, 0.05, 0, 1')
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
