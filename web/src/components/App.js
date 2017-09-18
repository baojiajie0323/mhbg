import React from 'react';
import Content from './content/content';
import styles from './App.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillUnMount() {
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.container}>
          <Content />
      </div>
    );
  }
}

export default App;
