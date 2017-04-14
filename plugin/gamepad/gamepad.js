// const Reveal = {};

( () => {
  const haveEvents = 'ongamepadconnected' in window;
  const controllers = {};
  let cooldownedButtons = [];

  function cooldown( b ) {
    if ( cooldownedButtons.indexOf( b ) < 0 ) {
      cooldownedButtons.push( b );

      setTimeout( () => {
        cooldownedButtons = cooldownedButtons.filter( ( v ) => ( v !== b ) );
      }, 250 );

      return true;
    }

    return false;
  }


  function connecthandler( e ) {
    addgamepad( e.gamepad );
  }

  function addgamepad( gamepad ) {
    controllers[ gamepad.index ] = gamepad;

    requestAnimationFrame( updateStatus );
  }

  function disconnecthandler( e ) {
    removegamepad( e.gamepad );
  }

  function removegamepad( gamepad ) {
    delete controllers[ gamepad.index ];
  }

  function updateStatus() {
    let i = 0;
    let j;

    if ( !haveEvents ) {
      scangamepads();
    }

    for ( j in controllers ) {
      const controller = controllers[ j ];

      for ( i = 0; i < controller.buttons.length; i++ ) {
        const val = controller.buttons[ i ];
        let pressed;

        if ( typeof ( val ) == 'object' ) {
          pressed = val.pressed;
        }

        if ( pressed && cooldown( 'button-' + i ) ) {
          switch ( i ) {
          case 0:
            if ( Reveal.isOverview() ) {
              Reveal.toggleOverview();
            } else {
              console.log( i );
            }
            break;
          case 4:
            Reveal.prev();
            break;
          case 6:
            Reveal.left();
            break;
          case 5:
            Reveal.next();
            break;
          case 7:
            Reveal.right();
            break;
          case 8:
            Reveal.togglePause();
            break;
          case 9:
            Reveal.toggleOverview();
            break;
          case 12:
            Reveal.up();
            break;
          case 13:
            Reveal.down();
            break;
          case 14:
            Reveal.left();
            break;
          case 15:
            Reveal.right();
            break;
          default:
            console.log( i );
          }
        }
      }

      for ( i = 0; i < controller.axes.length; i++ ) {
        const val = controller.axes[ i ];

        if ( Math.abs( val ) > 0.85 ) {
          if ( cooldown( 'axis-' + i ) ) {
            switch ( i ) {
            case 0: {
              if ( val < 0 ) {
                Reveal.left();
              } else {
                Reveal.right();
              }
              break;
            }
            case 1: {
              if ( val < 0 ) {
                Reveal.up();
              } else {
                Reveal.down();
              }
              break;
            }
            }
          }
        }
      }
    }

    requestAnimationFrame( updateStatus );
  }

  function scangamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : ( navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [] );
    for ( let i = 0; i < gamepads.length; i++ ) {
      if ( gamepads[ i ] ) {
        if ( gamepads[ i ].index in controllers ) {
          controllers[ gamepads[ i ].index ] = gamepads[ i ];
        } else {
          addgamepad( gamepads[ i ] );
        }
      }
    }
  }

  window.addEventListener( 'gamepadconnected', connecthandler );
  window.addEventListener( 'gamepaddisconnected', disconnecthandler );

  if ( !haveEvents ) {
    setInterval( scangamepads, 500 );
  }
} )();
