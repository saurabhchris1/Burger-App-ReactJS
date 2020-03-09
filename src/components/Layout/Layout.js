import React from "react";
import Aux from '../../hoc/Aux';
import classes from './layout.module.css';

const layout = (props) =>(
    <Aux>
        <div >Toolbar, Sidedrawer, back drop</div>
        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>
);

export default layout;