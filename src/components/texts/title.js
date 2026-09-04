import { Text } from "troika-three-text"
import { scene } from '../canvas/scene'

const title = new Text()

const font = "/fonts/Ubuntu/Ubuntu-Bold.ttf"

title.font = font
title.text = "CORVETTE C8"
title.fontSize = 0.5
title.color = 0xbc1038

title.position.set(1.3, 0.2, 0.55)
title.rotation.set(-Math.PI / 2,0, Math.PI / 2)

title.anchorX = "center"
title.anchorY = "center"

title.sync()

const subTitle = new Text()
subTitle.font = font
subTitle.fontSize = 0.2
subTitle.color = 0xFFFFFF
subTitle.text = 'CHEVROLET'

subTitle.position.set(1.2, 0.2, 1.6)
subTitle.rotation.set(-Math.PI / 2, 0, Math.PI / 2)

subTitle.anchorX = "center"
subTitle.anchorY = "center"

scene.add(title, subTitle)
