import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

//() => () é o mesmo que: () => { return (); }
const Routes: React.FC = () => (   //Temos que usar o exact na 1ª rota para fazer a comparação de igualdade como caminho
    <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/repositories/:repository+" component={Repository} />
    </Switch>
)  // O Switch garante que apenas 1 rota seja mostrada por vez
export default Routes;