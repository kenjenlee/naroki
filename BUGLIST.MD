1. add pitch, then change level, then add speed. Pitch level does not change proportion to the change of its container

TODO
1. Remove onmousedown and use only aftercomponentmount for ParamViewPanal
2. level of shift bar should render at the center of container at the start for pitch
3. robot ip and port are hardcoded

Notes
1. refs are only not null for components that are actually rendered, important esp when there are conditionally rendered components
2. remove battery from Nao (Dec 21), test it -> voltage -> use GUI of IP address for bat level 