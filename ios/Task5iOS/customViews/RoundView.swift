//
//  RoundView.swift
//  Task5iOS
//
//  Created by  Igor Anokhin on 16.09.2020.
//  Copyright © 2020  Igor Anokhin. All rights reserved.
//

import UIKit

class RoundView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }
    
    func setupView() {
        self.layer.cornerRadius = 10.0
        self.layer.borderWidth = 0.33
        self.layer.borderColor = ColorHelper().hexStringToUIColor(hex: "000000", alpha: 0.08).cgColor
        
    }
    

}
