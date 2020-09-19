//
//  CustomButton.swift
//  Task5iOS
//
//  Created by  Igor Anokhin on 16.09.2020.
//  Copyright © 2020  Igor Anokhin. All rights reserved.
//

import UIKit

@IBDesignable
class CustomButton: UIButton {
    private var cornerRadius: CGFloat = 25.0
    private var fillColor: UIColor = .blue
    
    @IBInspectable var borderColor: UIColor = UIColor.blue {
        didSet {
            layer.borderColor = borderColor.cgColor
        }
    }
    
    @IBInspectable var borderWidth: CGFloat = 2.0 {
        didSet {
            layer.borderWidth = borderWidth
        }
    }
    
    override public func layoutSubviews() {
        super.layoutSubviews()
        self.backgroundColor = ColorHelper().hexStringToUIColor(hex: "#4986CC")
        layer.cornerRadius = 10.0
    }
    
    override public var isHighlighted: Bool {
        didSet {
            switch isHighlighted {
            case true:
                backgroundColor = ColorHelper().hexStringToUIColor(hex: "#88B7EC")
                
               // alpha = 0.8
            case false:
                backgroundColor = ColorHelper().hexStringToUIColor(hex: "#4986CC")
                //  alpha = 1.0
               
            }
        }
    }
}
