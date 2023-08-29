//
//  ContentView.swift
//  Template
//
//  Created by Kristofer Bitney on 8/28/23.
//
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Button(action: {
                polywrapDemo()
            }) {
                Text("Click me and read the logs!")
            }
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
